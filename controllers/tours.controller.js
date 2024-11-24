import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import Tour from "../model/tours.model.js";
import {ApiFeatures} from "../utils/apiFeatures.js";
import {catchAsync} from "../utils/catchAsync.js";
import {AppError} from "../utils/appError.js";
import {createOne, deleteOne, getAll, getOne, updateOne} from "./handlerFactory.js";

//top level code, can be synchronous
const fileName = './data/tours.json';
const data = fs.readFileSync(fileName)
const tours = JSON.parse(data);

export const isValidId = (req, res, next, value) => {
    const params = req.params
    const tour = tours.find(tour => tour.id === parseInt(params.id));
    if (!tour) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }
    next()
}
export const checkBodyMiddleware = (req, res, next, value) => {
    if (!res.body) {
        return res.status(404).json({status: 'error', message: 'Request body is missing.'});
    }
    if (!res.body.name) {
        return res.status(404).json({status: 'error', message: 'Request name is missing.'});
    }
    if (!res.body.price) {
        return res.status(404).json({status: 'error', message: 'Request price is missing.'});
    }
    next()
}

export const topFiveCheap = catchAsync(async (req, res, next, value) => {
    //modify query
    req.query.limit = '5';
    console.log(req.query.limit)
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty,summary';
    next();
})

export const getAllTours = getAll(Tour)
// export const getAllTours = async (req, res) => {
//     try {
//         //EXTRACTED INTO APIFEATURES CLASS
//         //BUILD QUERY create copy for filtering, remove unwanted fields from query
//         // const queryObj = {...req.query};
//         // const excludeFields = ['page', 'sort', 'limit', 'fields'];
//         // excludeFields.forEach(field => delete queryObj[field]);
//         //
//         // //advanced filtering
//         // const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//         //
//         // let query = Tour.find(JSON.parse(queryStr));
//
//         //SORTING
//         // if (req.query.sort) {
//         //     const sortBy = req.query.sort.split(',').join(' '); //accept more params in query [-price, -ratingAverage]
//         //     query = query.sort(sortBy)
//         // } else {
//         //     query = query.sort('-createdAt'); //default sort
//         // }
//
//         //field limiting ?fields=name,price,ratingAverage
//         // if (req.query.fields) {
//         //     const limiting = req.query.fields.split(',').join(' ');
//         //     query = query.select(limiting); //default sort
//         // } else {
//         //     query = query.select('-__v'); //defaultly excludes __v field from document
//         // }
//
//         //PAGINATING QUERY page=2&limit=10
//         // const page = req.query.page * 1 || 1;
//         // const limit = req.query.limit * 1 || 100;
//         // const skip = (page - 1) * limit;
//         // query = query.skip(skip).limit(limit)
//
//         // if (req.query.page) {
//         //     const numTours = await Tour.countDocuments();
//         //     if (skip >= numTours) {
//         //         throw new Error('Page does not exist.');
//         //     }
//         // }
//
//
//         //EXECUTE QUERY
//         const features = new ApiFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();
//         const allTours = await features.query;
//
//         //SEND
//         res.status(200).json({
//             status: 'success',
//             results: allTours.length,
//             data: allTours
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({status: 'error', message: 'Failed to get tours.'});
//     }
// }
export const getTour = getOne(Tour, {path: 'reviews'})
// export const getTour = catchAsync(async (req, res, next) => {
//     //has middleware to validate id => isValidId()
//
//     const tour = await Tour.findById(req.params.id).populate('reviews')  //uses virtual populate MW
//
//     //TODO add 404 to other methods
//     if (!tour) {
//         return new AppError("Tour with this id not found", 404);
//     }
//
//     res.status(200).json({
//         status: 'success',
//         data: tour
//     })
// })
export const addTour = createOne(Tour)
// export const addTour = catchAsync(async (req, res) => {
//     try {
//         const newTour = await Tour.create(req.body)
//         res.status(201).json({
//             status: 'success',
//             data: newTour
//         });
//
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({status: 'error', message: 'Failed to add tour: ' + error});
//     }
// })
export const editTour = updateOne(Tour)
// export const editTour = catchAsync(async (req, res) => {
//
//         //method used for PATCH request, doesnt work with PUT
//         const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         })
//         res.status(200).json({
//             status: 'success',
//             data: updatedTour
//         });
//         res.status(500).json({status: 'error', message: 'Failed to find a tour: ' + error});
// })
//TODO switch to handler in other methods
export const deleteTour = deleteOne(Tour)
// export const deleteTour = catchAsync(async (req, res) => {
//     try {
//         await Tour.findByIdAndDelete(req.params.id)
//         res.status(204).json({
//             status: 'success',
//             message: "tour " + req.params.id + " deleted",
//             data: null
//         });
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({status: 'error', message: 'Failed to find a tour: ' + error});
//     }
// })
export const getTourStats = catchAsync(async (req, res) => {
    try {
        //array of stages for aggregation
        const stats = await Tour.aggregate([
            // match all tours that have rating above or == 4.5
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            // group all
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            },
            {
                $match: {
                    _id: {$ne: 'EASY'} //exclude easy
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a tour: ' + error});
    }
})

export const getMonthlyPlans = catchAsync(async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: 'startDates' //split array into individual documents
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(year, 1, 1), //start of year
                        $lte: new Date(year, 12, 31) //end of year
                    }

                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTours: {$sum: 1},//number of tours in the month
                    tourNames: {$push: '$name'}//list of tours in the month
                }
            },
            {
                $addFields: {
                    month: '$_id',//add month field
                    year: year
                }
            },
            {
                $project: { // remove _id field from output
                    _id: 0
                }
            },
            {
                $sort: {
                    numTours: -1
                }
            },
            {
                $limit: 6
            }
        ])
    } catch (error) {

    }
})