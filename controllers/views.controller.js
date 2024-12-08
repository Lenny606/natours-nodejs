import {AppError} from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";
import Tour from "../model/tours.model.js";
import User from "../model/users.model.js";
import Booking from "../model/bookings.model.js";

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
    res.status(200).render('admin/admin', {
        title: `Dashboard`
    })
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
export const submitAdminForm = async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })
    //render page again with udpated user
    res.status(200).render('admin/admin', {
        title: `Dashboard`,
        user: updatedUser
    })
}

export const getMyTours = async (req, res, next) => {

    const bookings = await Booking.find({user: req.user.id})
    const tourIds = bookings.map(item => item.tour)
    const tours = await Tour.find({_id: {$in: tourIds}}).populate('reviews')
    //render page again with udpated user
    res.status(200).render('overview', {
        title: `My Tours`,
        tours
    })
}