import mongoose from 'mongoose';
import slugify from 'slugify';

const reviewSchema = new mongoose.Schema({

        review: {
            type: String,
            required: [true, 'A review must have a content'],
            maxLength: [500, 'Review content must have less than or equal to 500 characters'],
            // minLength: [10, 'Review content must have more than or equal to 10 characters'],
            // validate: [validator.isAlpha(), 'Review content must contain only alphabetical characters']
        },
        rating: {
            type: Number,
            required: [true, 'A review must have a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5']
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour'
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]
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
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    })
})
const Review = mongoose.model('Review', reviewSchema);
export default Review;

