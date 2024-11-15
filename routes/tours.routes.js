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
const tourRouter = express.Router()

//middleware to validate id
// tourRouter.param('id', isValidId)

//alias endpoint
tourRouter.route('/top-5-cheap').get(topFiveCheap, getAllTours)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan').get(getMonthlyPlans)

tourRouter.route('/')
    .get(getAllTours)
    .post(checkBodyMiddleware, addTour)

tourRouter.route('/:id')
    .get(getTour)
    .patch(editTour)
    .delete(deleteTour)



export default tourRouter;