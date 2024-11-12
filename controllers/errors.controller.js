import {AppError} from "../utils/appError.js";

export const globalErrorHandler = (err, req, res, next) => {
    err.status = err.status || "error"
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Error"

    if (process.env.NODE_ENV !== "production") {
        sendErrorDev(err, res)
    } else {
        let error = {...err}
        if (error.name === "CastError") {
            error = handleDBError(error)
        }
        sendErrorProd(error, res)
    }
}

function sendErrorProd(err, res) {
    if (err.isOperational) {
        res.status(err.status).json({
            status: err.status,
            error: err
        })
    } else {
        //programing error - generic response
        //log
        console.error(err)
        //send
        res.status(500).json({
            status: 'error',
            message: "Something went wrong"
        })
    }

}

function sendErrorDev(err, res) {
    res.status(err.status).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

function handleDBError(err) {
    const msg = 'Invalid path ' + err.path + ": " + err.value
    return new AppError(400, msg)
}
