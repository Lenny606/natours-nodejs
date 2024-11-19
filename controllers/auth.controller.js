import User from "../model/users.model.js";
import {catchAsync} from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"
import {promisify} from "util"
import {AppError} from "../utils/appError.js";

const signToken = (id) => {
    const token = jwt.sign({
            id: id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        })
    return token
}

export const signUpUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id)

    return res.status(201).json({
        status: "success",
        token,
        data: newUser,
    });
});

export const loginUser = async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(new AppError("Invalid email or password", 400))
    }

    const user = await User.findOne({email}).select('+password')
    // const correct = await user.confirmPassword(password, user.password)

    if (!user || !(await user.confirmPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401))
    }
    const token = signToken(user._id)
    return res.status(200).json(
        {
            status: "success",
            token,
            message: "Logged in successfully"
        }
    )
}
export const protectRoute = catchAsync(async (req, res, next) => {
    //get token
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new AppError("You are not logged in", 401))
    }
    //validate token , verify() is async function , use promisify
    const decodedData = await promisify(jwt.verify(token, process.env.JWT_SECRET))

    //check user if still exists using docoded ID
    const currentUser = await User.findById(decodedData.id)
    if (!currentUser) {
        return next(new AppError("User no longer exists", 401))
    }
    //check if password wasnt changed / login on model
    if (currentUser.changedPasswordAfter(decodedData.iat)) {
        return next(new AppError("User password has been changed... Login again", 401))
    }
    //access granted
    req.user = currentUser
    next()
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        //user comes from 1st MW
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403))
        }
        next()
    }
}

export const forgotPassword = catchAsync(async (req, res, next) => {
    //get user by email
    const user = User.findOne({email: req.body.email})
    if (!user) {
        return next(new AppError("No user found", 404))
    }
    //generate token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false}) //disable mandatory fields
    //send email
})
export const resetPassword = catchAsync((req, res, next) => {
})