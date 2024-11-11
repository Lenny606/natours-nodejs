import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            unique: true,
            trim: true,
            maxLength: [50, 'A user name must have less than or equal to 50 characters'],
            minLength: [10, 'A user name must have more than or equal to 10 characters'],
            // validate: [validator.isAlpha(), 'User name must contain only alphabetical characters']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //excludes this field from returned documents
        }, //or use timestamps: true in schema options

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
// userSchema.virtual('').get(function () {
//     return
// })

//DOCUMENT MW -only for save/create


//QUERY MIDDLEWARE - find hooks find/findOne etc...
// userSchema.pre(/^find/, function (next) {
//     this.find({
//         secretUsers: {
//             $ne: true
//         }
//     })
//     this.start = Date.now()
//     next()
// })
// userSchema.post(/^find/, function (document, next) {
//     console.log(`Query took: ${Date.now() - this.start} milliseconds`)
//     next()
// })
// //AGREGATION MIDDLEWARE - aggregate hooks
// userSchema.pre('aggregate', function (next) {
//     //add some custom pipeline stages into array
//     this.pipeline().unshift({
//         $match: {
//             secretUsers: {
//                 $ne: true
//             }
//         }
//     })
//     next()
// })

const User = mongoose.model('User', userSchema);
export default User;

