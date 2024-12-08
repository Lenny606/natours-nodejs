import Stripe from 'stripe'
import {catchAsync} from "../utils/catchAsync.js";
import Tour from "../model/tours.model.js";
import Booking from "../model/bookings.model.js";


export const getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = Tour.findById(req.params.tourId)

    const stripe = new Stripe(process.env.STRIPE_SECRET)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            name: tour.name,
            description: tour.summary,
            images: [''],
            amount: tour.price * 100,
            quantity: 1,
            currency: 'usd'
        }]
    })

    res.status(200).json({status: 'success', session})

    next();
})

export const createBookingCheckout = catchAsync(async (req, res, next) => {
    const {tour, price, user} = req.query

    if (!tour || !price || !user) {
        return next()
    }
    await Booking.create({tour, price, user})

    res.redirect(req.originalUrl.split('?')[0])
})
