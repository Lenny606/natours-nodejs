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
        role: {
            type: String,
            enum: ['user', 'admin', 'guide', "lead-guide"],
            default: 'user'
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
        photo: {
            type: String,
            default: 'default.jpg'},
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //excludes this field from returned documents
        }, //or use timestamps: true in schema options
        passwordChangedAt: {
            type: Date,
            select: false
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
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
//mw for resetPassword process
userSchema.pre('save', async (next) => {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000 // do with small difference
    next()
})
//filter inactive users (not equal to false)
userSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}})
    next()
})

userSchema.methods.confirmPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
    if (this.passwordChangedAt) {
        const changedPass = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedPass;
    }
    return false
}

userSchema.methods.createPasswordResetToken = () => {
    const token = crypto.getRandomValues(32).toString('hex')
    //hash token
    this.passwordResetToken = crypto.createHash("sha256").update(token).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 min
    return token;
}


const User = mongoose.model('User', userSchema);
export default User;

