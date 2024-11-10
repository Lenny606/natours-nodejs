export const schemaValidation = (schema) => (req, res, next) => {
    const {error} = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const {details} = error;
        const {message} = details.map(({item}) => ({
            message: item.message,
            path: item.path
        }))
        return res.status(422).json({status: 'error', message: message});
    }
    next();
}