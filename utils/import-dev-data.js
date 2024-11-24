import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import Tour from "../model/tours.model.js";
import {connectDB} from "../db.js";
import User from "../model/users.model.js";
import Review from "../model/reviews.model.js";

//Setup
dotenv.config();
connectDB();
const toursData = fs.readFileSync('./data/tours.json', 'utf-8');
const usersData = fs.readFileSync('./data/users.json', 'utf-8');
const reviewsData = fs.readFileSync('./data/reviews.json', 'utf-8');
const parsedToursData = JSON.parse(toursData);
const parsedUsersData = JSON.parse(usersData);
const parsedReviewsData = JSON.parse(reviewsData);

//Import Data
const importData = async (args) => {
    let data
    let model
    if (args === "--users") {
         data = parsedUsersData
        model = User
    } else if (args === "--tours") {
        data = parsedToursData
        model = Tour
    } else if (args === "--reviews") {
        data = parsedReviewsData
        model = Review
    } else {
        console.log('Missing collection argument - users /tours/reviews');
        process.exit();
    }

    try {
        await model.create(data, {validateBeforeSave: false}); //accept array
        console.log('Data Imported...');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        process.exit();
    }
}

//Delete All Data

const purgeCollection = async (args) => {
    try {
        if (args === "--users") {
            await User.deleteMany()
        } else if (args === "--tours") {
            await Tour.deleteMany()
        }else if (args === "--reviews") {
            await Review.deleteMany()
        } else {
            console.log('Missing collection argument - users /tours/reviews');
            process.exit();
        }
        console.log('Data deleted...');

    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        process.exit();
    }
}

//Arguments for cli: node utils/import-dev-data.js --import/--purge  --tours/--users/--reviews
if (process.argv[2] === '--import') {
    importData(process.argv[3]);
} else if (process.argv[2] === '--purge') {
    purgeCollection(process.argv[3]);
}