import express from 'express';
import dotenv from 'dotenv';
import Review from "../model/reviews.model.js";
import {ApiFeatures} from "../utils/apiFeatures.js";
import {catchAsync} from "../utils/catchAsync.js";
import {AppError} from "../utils/appError.js";



export const topFiveReviews = catchAsync(async (req, res, next, value) => {
    //modify query
    req.query.limit = '5';
    req.query.sort = '-rating';
    next();
})

export const getReviews = async (req, res) => {
    try {
        const features = new ApiFeatures(Review.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const allReviews = await features.query;

        //SEND
        res.status(200).json({
            status: 'success',
            results: allReviews.length,
            data: allReviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get reviews.'});
    }
}

export const getReview = catchAsync(async (req, res, next) => {
    //has middleware to validate id => isValidId()

    const review = await Review.findById(req.params.id)

    //TODO add 404 to other methods
    if (!review) {
        return new AppError("Tour with this id not found", 404);
    }

    res.status(200).json({
        status: 'success',
        data: review
    })
})

export const addReview = catchAsync(async (req, res) => {
    try {
        const newReview = await Review.create(req.body)
        res.status(201).json({
            status: 'success',
            data: newReview
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({status: 'error', message: 'Failed to add review: ' + error});
    }
})
export const editReview = catchAsync(async (req, res) => {

    try {
        //method used for PATCH request, doesnt work with PUT
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: updatedReview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a review: ' + error});
    }
})

export const deleteReview = catchAsync(async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            message: "review " + req.params.id + " deleted",
            data: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a review: ' + error});
    }
})