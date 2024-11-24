import {catchAsync} from "../utils/catchAsync.js";
import {AppError} from "../utils/appError.js";
import Tour from "../model/tours.model.js";
import Review from "../model/reviews.model.js";
import {ApiFeatures} from "../utils/apiFeatures.js";

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

export const updateOne = Model => catchAsync(
    async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!document) {
            return next(new AppError(`No ${Model.modelName} found with id ${req.params.id}`, 404));
        }
        res.status(200).json({
            status: 'success',
            data: document
        });
    })

export const createOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.create(req.body)
        res.status(201).json({
            status: 'success',
            data: doc
        })
    })

export const getOne = (Model, populateOptions) => catchAsync(
    async (req, res, next) => {
        let query = await Model.findById(req.params.id)
        if (populateOptions) {
            query.populate(populateOptions)
        }
        const document = await query

        //TODO add 404 to other methods
        if (!document) {
            return new AppError(`No ${Model.modelName} found with id ${req.params.id}`, 404);
        }

        res.status(200).json({
            status: 'success',
            data: document
        })
    }
)

export const getAll = (Model) => catchAsync(

    async (req, res, next) => {
        //only for reviews nested route , if id is in params
        let filter = {}
        if (req.params.tourId) {
            filter ={
                tour: req.params.tourId
            }
        }

        const features = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;

        //SEND
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
    }
)
