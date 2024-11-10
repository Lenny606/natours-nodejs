import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
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
