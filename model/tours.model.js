import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [50, 'A tour name must have less than or equal to 50 characters'],
            minLength: [10, 'A tour name must have more than or equal to 10 characters']
        },
        slug: String,
        secretTours: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            required: [true, 'A duration is missing'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A group size is missing'],
        },
        difficulty: {
            type: String,
            required: [true, 'A difficulty is missing'],
            enum:
                {
                    values: ['easy', 'medium', 'difficult'],
                    message: 'Difficulty must be easy, medium, or difficult'
                }
        },
        ratingsAverage: {
            type: Number,
            default: 4,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: Number,
        summary: {
            type: String,
            required: [true, 'A tour must have a summary'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a image cover'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //excludes this field from returned documents
        }, //or use timestamps: true in schema options
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
//not part of database
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

//DOCUMENT MW -only for save/create
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next()
})
tourSchema.post('save', function (document, next) {
    console.log(document)
    next()
})

//QUERY MIDDLEWARE - find hooks find/findOne etc...
tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTours: {
            $ne: true
        }
    })
    this.start = Date.now()
    next()
})
tourSchema.post(/^find/, function (document, next) {
    console.log(`Query took: ${Date.now() - this.start} milliseconds`)
    next()
})
//AGREGATION MIDDLEWARE - aggregate hooks
tourSchema.pre('aggregate', function (next) {
    //add some custom pipeline stages into array
    this.pipeline().unshift({
        $match: {
            secretTours: {
                $ne: true
            }
        }
    })
    next()
})

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;

