import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            maxLength: [50, 'A user name must have less than or equal to 50 characters'],
            // minLength: [10, 'A user name must have more than or equal to 10 characters'],
            // validate: [validator.isAlpha(), 'User name must contain only alphabetical characters']
        },
        email: {
            type: String,
            required: [true, 'A user must have a email'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'User email is not valid']
        },
        password: {
            type: String,
            required: [true, 'A user must have a password'],
            minLength: [4, 'A user password must have more than or equal to 4 characters'],
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'A user must have a password'],
            minLength: [4, 'A user password must have more than or equal to 4 characters'],
            validate: {
                validator: function (value) {
                    return this.password === value;
                },
                message: 'Passwords do not match'
            }

        },
        photo: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //excludes this field from returned documents
        }, //or use timestamps: true in schema options
        passwordChangedAt: {
            type: Date,
            select: false
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

userSchema.pre('save', async (next) => {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.confirmPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
    if(this.passwordChangedAt) {
        const changedPass = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedPass;
    }
    return false
}


const User = mongoose.model('User', userSchema);
export default User;

