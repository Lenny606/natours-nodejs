import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import {AppError} from "./utils/appError.js";
import {globalErrorHandler} from "./controllers/errors.controller.js"
import tourRouter from './routes/tours.routes.js';
import userRouter from './routes/users.routes.js';

export const app = express();
dotenv.config()
//middlewares 3rd party
app.use(express.json())
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))//logs requests
}
app.use(express.static('public'))//serve static files


//custom middleware
app.use((req, res, next) => {
    //add timestamp to request object
    req.requestedAt = new Date().toISOString()
    next()
})


app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

//Handler for undefined routes (last in stack order)
app.all('*', (req, res, next) => {
    // 1. st implemantation
    // res.status(404).json(
    //     {
    //         status: 'fail',
    //         message: 'Can not find ' + req.originalUrl
    //     }
    // )

    // 2nd implementation
    // const err = new Error('Can not find ' + req.originalUrl)
    // err.statusCode = 404
    // err.status = "fail"

    //last implementation
    next(new AppError('Can not find ' + req.originalUrl, 404)) //if arg in next is passed , node would now that is Error
})

//node recognize automatically that this is error middleware if err parameter exists
app.use(globalErrorHandler);