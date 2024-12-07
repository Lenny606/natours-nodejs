import express from 'express';
import {
    getAdmin,
    getDetail,
    getLoginForm,
    getOverview,
    protectedRoute,
    submitAdminForm
} from "../controllers/views.controller.js";
import {isLoggedIn} from "../controllers/auth.controller.js";

const viewRouter = express.Router()

//admin route
viewRouter.get("/admin", protectedRoute, getAdmin)

//use mw for every template
viewRouter.use(isLoggedIn) //passes user to every route
viewRouter.get("/", getOverview)
viewRouter.get("/tour/:slug", getDetail)
viewRouter.get("/admin", getAdmin)
viewRouter.get("/login", getLoginForm)
viewRouter.post("/submit-admin-form", submitAdminForm)



export default viewRouter;