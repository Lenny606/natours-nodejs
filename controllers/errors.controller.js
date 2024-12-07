import {AppError} from "../utils/appError.js";

export const globalErrorHandler = (err, req, res, next) => {
    err.status = err.status || "error"
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Error"

    if (process.env.NODE_ENV !== "production") {
        sendErrorDev(err, res)
    } else {
        let error = {...err}
        error.message = err.message
        if (error.name === "CastError") {
            error = handleCastDBError(error)
        }
        if (error.code === 11000) {
            error = handleDuplicityDBError(error)
        }
        if (error.name === 'ValidationError') {
            handleValidationDBError(error)
        }
        if (error.name === 'JsonWebTokenError') {
            handleJsonWebTokenError(error)
        }
        if (error.name === 'TokenExpiredError') {
            handleJsonWebExpiredTokenError(error)
        }

        sendErrorProd(error, res)
    }
}

function sendErrorProd(err, req, res) {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.status).json({
                status: err.status,
                error: err
            })
        } else {
            //programing error - generic response
            //log
            console.error(err)
            //send
            return res.status(500).json({
                status: 'error',
                message: "Something went wrong"
            })
        }
    } else {
        //VIEW ERROR
        if (err.isOperational) {
            return res.status(err.status).json({
                status: err.status,
                error: err
            })
        } else {
            return res.status(err.statusCode).render('error/error', {
                title: 'Something went wrong',
                msg: 'Try again later',
            })
        }
    }
}

function sendErrorDev(err, req, res) {
    //API + VIEW error page
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.status).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    } else {
        return res.status(err.statusCode).render('error/error', {
            title: 'Something went wrong',
            msg: err.message,
            stack: err.stack
        })
    }

}

function handleCastDBError(err) {
    const msg = 'Invalid path ' + err.path + ": " + err.value
    return new AppError(msg, 400)
}

function handleJsonWebTokenError(err) {
    const msg = 'Invalid Token...Login again'
    return new AppError(msg, 401)
}

function handleJsonWebExpiredTokenError(err) {
    const msg = 'Expired Token...Login again'
    return new AppError(msg, 401)
}

function handleDuplicityDBError(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const msg = 'Duplicity ' + value
    return new AppError(400, msg)
}

function handleValidationDBError(err) {
    const errors = Object.values(err.errors).map(err => err.message)
    const msg = 'Invalid data: ' + errors.join('. ')
    return new AppError(400, msg)
}
