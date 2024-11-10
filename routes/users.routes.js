import express from 'express';
import dotenv from 'dotenv';
import {addUser, editUser, getAllUsers, getUser, deleteUser} from "../controllers/users.controller.js";
const userRouter = express.Router()

userRouter.route('/')
    .get(getAllUsers)
    .post(addUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(editUser)
    .delete(deleteUser)



export default userRouter;