import mongoose from 'mongoose';
import slugify from 'slugify';
import User from "./users.model.js";

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [50, 'A tour name must have less than or equal to 50 characters'],
            minLength: [10, 'A tour name must have more than or equal to 10 characters'],
            // validate: [validator.isAlpha(), 'Tour name must contain only alphabetical characters']
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
            max: [5, 'Rating must be at most 5'],
            //setter for value every time if change happens
            set: val => Math.round(val * 10) / 10  //4.66666 => 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                //only for save / create operations
                validator: function (value) {
                    return value < this.price;
                },
                message: 'Price discount ({VALUE}) cannot be more than the price'
            }
        },
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
        startDates: [Date],
        startLocation: {
            //geojson
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                required: [true, 'Start location must have coordinates']
            },
            address: String,
            description: String
        },
    //if array of object is defined Mongo creates a new embedded document
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
    guides: [
        {
            //child reference
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            // required: [true, 'A tour must have a guide']
        }
    ]
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
//set indexing - compound index for price asc and average desc
tourSchema.index({ price: 1, ratingsAverage: -1 })
// tourSchema.index({ priceDiscount: 1 })
// tourSchema.index({ ratingsAverage: -1 })
// tourSchema.index({ startDates: 1 })
// tourSchema.index({ startLocation: '2dsphere' })
//not part of database
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

//set User object as guides from id in request (embbed refonly for create/save new tour)
// tourSchema.pre('save', async function(next){
//     const guidesPromises = this.guides.map(async id =>  await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next()
// })

//DOCUMENT MW -only for save/create
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next()
})
tourSchema.post('save', function (document, next) {
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
//populates referenced data
tourSchema.pre(/^find/, function (next) {
    this.populate(
        {
            path: 'guides',
            select: '-__v -passwordChangedAt' //exclude password and passwordChangedAt fields from guides
        }//add populating reference to the query
    )
    next()
})
//VIrtual Populates References
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
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

