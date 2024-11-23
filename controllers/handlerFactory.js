import {catchAsync} from "../utils/catchAsync.js";
import {AppError} from "../utils/appError.js";

export const deleteOne = Model => catchAsync(
    async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id);
        if (!document) {
            return next(new AppError(`No ${Model.modelName} found with id ${req.params.id}`, 404));
        }
        res.status(204).json({
            status: 'success',
            message: Model.modelName + " " + req.params.id + " deleted",
            data: null
        });
    }
)