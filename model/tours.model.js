import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true, trim: true
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
    },
    ratingAverage: {
        type: Number,
        default: 4
    },
    ratingQuantity: {
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
})

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;

