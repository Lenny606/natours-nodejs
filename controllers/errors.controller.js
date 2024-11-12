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
            error = handleCastDBError(error)
        }
        if (error.code === 11000) {
            error = handleDuplicityDBError(error)
        }
        if (error.name ==='ValidationError') {
            handleValidationDBError(error)
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

function handleCastDBError(err) {
    const msg = 'Invalid path ' + err.path + ": " + err.value
    return new AppError(400, msg)
}

function handleDuplicityDBError(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const msg = 'Duplicity ' + value
    return new AppError(400, msg)
}
function handleValidationDBError(err) {
const errors = Object.values(err.errors).map(err =>err.message)
    const msg = 'Invalid data: ' + errors.join('. ')
    return new AppError(400, msg)
}
