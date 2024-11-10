import express from 'express';
import dotenv from 'dotenv';
import {
    addTour,
    editTour,
    getAllTours,
    getTour,
    deleteTour,
    isValidId,
    checkBodyMiddleware
} from "../controllers/tours.controller.js";
const tourRouter = express.Router()

//middleware to validate id
// tourRouter.param('id', isValidId)

tourRouter.route('/')
    .get(getAllTours)
    .post(checkBodyMiddleware, addTour)

tourRouter.route('/:id')
    .get(getTour)
    .patch(editTour)
    .delete(deleteTour)



export default tourRouter;