import User from "../model/users.model.js";
import {catchAsync} from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"
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