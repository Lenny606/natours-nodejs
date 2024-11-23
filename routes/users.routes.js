import express from 'express';
import dotenv from 'dotenv';
import {addUser, editUser, getAllUsers, getUser, deleteUser, updateMe, deleteMe} from "../controllers/users.controller.js";
import {
    loginUser,
    resetPassword,
    signUpUser,
    forgotPassword,
    updatePassword,
    protectRoute, restrictTo
} from "../controllers/auth.controller.js";
const userRouter = express.Router()

userRouter.route('/')
    .get(getAllUsers)
    .post(addUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(editUser)
    .delete(deleteUser)

//auth logic
userRouter.post('/signup', signUpUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword/:token', resetPassword)
userRouter.patch('/updatePassword', protectRoute, updatePassword)

//data modifications
userRouter.patch('/updateMe', protectRoute, updateMe )
userRouter.delete('/deleteMe', protectRoute, deleteMe )
export default userRouter;