import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            maxLength: [50, 'A user name must have less than or equal to 50 characters'],
            minLength: [10, 'A user name must have more than or equal to 10 characters'],
            // validate: [validator.isAlpha(), 'User name must contain only alphabetical characters']
        },
        email: {
            type: String,
            required: [true, 'A user must have a email'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail(), 'User email is not valid']
        },
        password: {
            type: String,
            required: [true, 'A user must have a password'],
            minLength: [4, 'A user password must have more than or equal to 4 characters'],
        },
        passwordConfirm: {
            type: String,
            required: [true, 'A user must have a password'],
            minLength: [4, 'A user password must have more than or equal to 4 characters'],
            // validate: []

        },
        photo: String,
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

const User = mongoose.model('User', userSchema);
export default User;

