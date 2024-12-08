import express from 'express';
import {
    getCheckoutSession
} from "../controllers/bookings.controller.js";
import {
    protectRoute
} from "../controllers/auth.controller.js";

const bookingRouter = express.Router()

//checkout session
bookingRouter.get("/checkout-session/:tourId", protectRoute, getCheckoutSession)

export default bookingRouter;