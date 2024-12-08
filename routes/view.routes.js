import express from 'express';
import {
    getAdmin,
    getDetail,
    getLoginForm, getMyTours,
    getOverview,
    protectedRoute,
    submitAdminForm
} from "../controllers/views.controller.js";
import {isLoggedIn} from "../controllers/auth.controller.js";
import {createBookingCheckout} from "../controllers/bookings.controller.js";

const viewRouter = express.Router()

//admin route
viewRouter.get("/admin", protectedRoute, getAdmin)
viewRouter.get("/", createBookingCheckout, isLoggedIn, getOverview)

//use mw for every template
viewRouter.use(isLoggedIn) //passes user to every route

viewRouter.get("/tour/:slug", getDetail)
viewRouter.get("/admin", getAdmin)
viewRouter.get("/login", getLoginForm)
viewRouter.post("/submit-admin-form", submitAdminForm)
viewRouter.post("/my-tours", getMyTours )



export default viewRouter;