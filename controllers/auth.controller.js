import User from "../model/users.model.js";
import {catchAsync} from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"

export const signUpUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({
            id: newUser._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        }
    )
    res.status(201).json({
        status: "success",
        token,
        data: newUser,
    });
});