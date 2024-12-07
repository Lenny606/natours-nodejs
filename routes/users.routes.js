import express from 'express';
import {
    addUser,
    editUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe, uploadUserPhoto, resizePhoto
} from "../controllers/users.controller.js";
import {
    loginUser,
    resetPassword,
    signUpUser,
    forgotPassword,
    updatePassword,
    protectRoute, restrictTo, logoutUser
} from "../controllers/auth.controller.js";

const userRouter = express.Router()

//auth logic, not protected
userRouter.post('/signup', signUpUser)
userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUser)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword/:token', resetPassword)

//adds MW to all routes below in the stack TODO setup in other routers
userRouter.use(protectRoute)

//auth logic, protected
userRouter.patch('/updatePassword', updatePassword)

//restricted , adds MW to all routes below in the stack
userRouter.use(restrictTo('admin'))

//data fetching/modifing
userRouter.route('/')
    .get(getAllUsers)
    .post(addUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(editUser)
    .delete(deleteUser)


//data modifications
userRouter.patch('/updateMe', uploadUserPhoto, resizePhoto, updateMe)
userRouter.delete('/deleteMe', deleteMe)

//get users own data
userRouter.get("/me", getMe, getUser)
export default userRouter;