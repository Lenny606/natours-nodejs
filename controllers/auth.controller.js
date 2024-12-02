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

const createAndSendToken = (user, statusCode, res) => {

    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        httpOnly: true, //only browser
    }
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true //activate ssl
    }
    //remove pass from resp
    user.password = undefined
    res.cookie("jwt",)

    return res.status(statusCode).json({
        status: "success",
        token,
        data: user,
    });
}

export const signUpUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createAndSendToken(newUser, 201, res)
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
    createAndSendToken(user, 200, res)
}
export const protectRoute = catchAsync(async (req, res, next) => {
    //get token from body or cookie
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
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
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request to ${resetURL} with your new password and passwordConfirm in the request body.`
    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token (valid for 10 minutes)",
            message
        })
        res.status(200).json({
            status: "success",
            message: "Reset token sent to email"
        })
    } catch (error) {
        //if error reset tokens
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})
        return next(new AppError("Failed to send email", 500))
    }
})
export const resetPassword = catchAsync(async (req, res, next) => {
    //get user
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    if (!user) {
        return next(new AppError("Token is invalid or expired", 401))
    }
    //set pass if user exist and token is not expired
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    //update passwordChangedAt
    // => handled by Middleware on user model

    //log in user, send jwt
    createAndSendToken(user, 200, res)
})

export const updatePassword = catchAsync(async (req, res, next) => {
    //check user, from user MW, add pass to json
    const user = await User.findById(req.user.id).select('+password')
    //check pass
    const password = await user.confirmPassword(req.body.password, user.password)
    if (!password) {
        return next(new AppError("Incorrect current password", 401))
    }
    //update pass
    this.password = req.body.password
    user.confirmPassword = req.body.passwordConfirm
    await user.save()
    //login usr
    createAndSendToken(user, 200, res)
})