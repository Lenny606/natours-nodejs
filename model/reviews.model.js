import mongoose from 'mongoose';
import slugify from 'slugify';
import Tour from "./tours.model.js";

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
//set compound index to prevent duplicate reviews from same user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    })
})
//statistic feature
reviewSchema.statics.calculateAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                averageRating: {
                    $avg: '$rating'
                }
            }

        }
    ])
    if (stats.length > 0) {
        Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].averageRating,
            ratingsQuantity: stats[0].nRating
        })
    } else {
        Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 4.5
        })
    }


}
reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.tour)
})
//workaround to pass data
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})
reviewSchema.post(/^findOneAnd/, async function () {
    this.r.constructor.calculateAverageRating(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema);
export default Review;

