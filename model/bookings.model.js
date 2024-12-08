import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
        //references
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'A tour must be associated with a booking']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A user must be associated with a booking']
        },
        price: {
            type: Number,
            required: [true, 'A booking must have a price'],
        },
        paid: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        toJSON: {
            virtuals: true
        }
        ,
        toObject: {
            virtuals: true
        }
    }
)

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: "tour",
        select: "name"
    })
})

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;