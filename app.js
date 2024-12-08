import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import  path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import {AppError} from "./utils/appError.js";
import {globalErrorHandler} from "./controllers/errors.controller.js"
import tourRouter from './routes/tours.routes.js';
import userRouter from './routes/users.routes.js';
import reviewRouter from "./routes/reviews.routes.js";
import viewRouter from "./routes/view.routes.js";
import bookingRouter from "./routes/bookings.routes.js";

export const app = express();
//setup template engine, no install
app.set('view engine', 'pug')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))//serve static files

dotenv.config()
app.use(cors()) //allows all
app.options('*', cors())//allows all methods
//set 100request per 1hr
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour.'
})
//middlewares 3rd party
app.use(helmet()) //helmet one of first mw in stack
app.use('/api', limiter)

//limit body data
app.use(express.json({
    limit: '10kb'
}))
app.use(express.urlencoded({
    extended:true,
    limit: "10kb"
})) //MW for Form Data in request (not for APi logic)
app.use(cookieParser()) //parse date from cookies

//checks for character injection
app.use(mongoSanitize())
//looks malicious html code
app.use(xss())
//prevents parameter pollution
app.use(hpp({
    whitelist: ['duration',
        'maxGroupSize',
        'maxDistance',
        "price",
        'ratingsQuantity',
        "ratingsAverage",
        'difficulty',
        ] //only allow these fields in query string
}))
app.use(compression()) //compress reqs data
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))//logs requests
}


//custom middleware
app.use((req, res, next) => {
    //add timestamp to request object
    req.requestedAt = new Date().toISOString()
    next()
})

//TEMPLATES
app.use('/', viewRouter)

//API
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/bookings", bookingRouter)

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