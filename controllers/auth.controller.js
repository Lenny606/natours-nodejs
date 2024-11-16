import User from "../model/users.model.js";
import {catchAsync} from "../utils/catchAsync.js";

export const signUpUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: "success",
        data: newUser,
    });
});