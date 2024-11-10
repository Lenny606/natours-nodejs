import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL)
        console.log('connection dtb success')
    } catch (err) {
        console.log('connection dtb error: ' + err)
        process.exit(1)
    }
}