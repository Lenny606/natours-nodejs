import express from 'express';
import dotenv from 'dotenv';
import {
    addReview,
    editReview,
    getAllReviews,
    getReview,
    deleteReview,
    isValidId,
    getReviews,
    topFiveReviews
} from "../controllers/reviews.controller.js";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {protectRoute, restrictTo} from "../controllers/auth.controller.js";
const reviewRouter = express.Router()

//middleware to validate id
// reviewRouter.param('id', isValidId)

//alias endpoint
reviewRouter.route('/top-5-reviews').get(topFiveReviews, getReviews)

reviewRouter.route('/')
    .get(protectRoute,restrictTo('user'), getReviews)
    .post(addReview)

reviewRouter.route('/:id')
    .get(getReview)
    .patch(editReview)
    .delete(protectRoute, restrictTo('admin', 'lead-guide') ,deleteReview)



export default reviewRouter;