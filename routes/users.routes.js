import express from 'express';
import dotenv from 'dotenv';
import {addUser, editUser, getAllUsers, getUser, deleteUser} from "../controllers/users.controller.js";
import {
    loginUser,
    resetPassword,
    signUpUser,
    forgotPassword,
    updatePassword,
    protectRoute
} from "../controllers/auth.controller.js";
const userRouter = express.Router()

userRouter.route('/')
    .get(getAllUsers)
    .post(addUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(editUser)
    .delete(deleteUser)

userRouter.post('/signup', signUpUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword/:token', resetPassword)
userRouter.patch('/updatePassword', protectRoute, updatePassword)
export default userRouter;