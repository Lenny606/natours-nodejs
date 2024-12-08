import express from 'express';
import {
    createBooking, deleteBooking,
    getAllBookings,
    getBooking,
    getCheckoutSession,
    updateBooking
} from "../controllers/bookings.controller.js";
import {protectRoute, restrictTo} from "../controllers/auth.controller.js";

const bookingRouter = express.Router()
bookingRouter.use(protectRoute)
//checkout session
bookingRouter.get("/checkout-session/:tourId", protectRoute, getCheckoutSession)

bookingRouter.use(restrictTo('admin', 'lead-guide'))
//CRUD
bookingRouter.route("/")
    .get(getAllBookings)
    .post(createBooking)
bookingRouter.route("/:id")
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking)

export default bookingRouter;