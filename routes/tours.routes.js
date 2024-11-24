import express from 'express';
import dotenv from 'dotenv';
import {
    addTour,
    editTour,
    getAllTours,
    getTour,
    deleteTour,
    isValidId,
    checkBodyMiddleware, topFiveCheap, getTourStats, getMonthlyPlans
} from "../controllers/tours.controller.js";
import toursModel from "../model/tours.model.js";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {protectRoute, restrictTo} from "../controllers/auth.controller.js";
import userRouter from "./users.routes.js";
import reviewRouter from "./reviews.routes.js";
import {addReview, setTourAndUserId} from "../controllers/reviews.controller.js";

const tourRouter = express.Router()

//middleware to validate id
// tourRouter.param('id', isValidId)

//use review Router if route is
tourRouter.use('/:tourId/reviews', reviewRouter)

//alias endpoint
tourRouter.route('/top-5-cheap').get(topFiveCheap, getAllTours)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan').get(getMonthlyPlans)

tourRouter.route('/')
    .get(getAllTours)
    .post(protectRoute, restrictTo('admin', 'lead-guide'), checkBodyMiddleware, addTour)

tourRouter.route('/:id')
    .get(getTour)
    .patch(protectRoute, restrictTo('admin', 'lead-guide'), editTour)
    .delete(protectRoute, restrictTo('admin', 'lead-guide'), deleteTour)

//nested routes
userRouter.route('/:tourId/reviews').post(protectRoute, restrictTo('user'), setTourAndUserId, addReview)


export default tourRouter;