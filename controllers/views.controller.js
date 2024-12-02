import {AppError} from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";
import Tour from "../model/tours.model.js";

//test
export const getBase = (req, res) => {
    res.status(200).render('base', {
        tours: "Tours",
        name: "Jon Doe"
    })
}

export const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: "All Tours",
        tours: tours
    })
})

export const getDetail = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    console.log(tour)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    })
})
export const getAdmin = catchAsync(async (req, res) => {
    res.status(200).render('admin/admin', {})
})

export const getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: `Login`
    })
})
export const protectedRoute = (req, res, next) => {
    const protect = true
    if (!protect) {
        throw AppError(401)
    }
    next()
}