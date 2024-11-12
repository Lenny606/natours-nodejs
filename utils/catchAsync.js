//catching errors in async functions, errors in next are handled by error middleware
export const catchAsync = fn => {
    return function (req, res, err) {
        fn(req, res, err).catch(next)
    }
}