
export const globalErrorHandler = (err, req, res, next) => {
        err.status = err.status || "error"
        err.statusCode = err.statusCode || 500
        err.message = err.message || "Error"

        res.status(err.status).json({
            status: err.status,
            message: err.message
        })
    }