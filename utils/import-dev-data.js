import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import Tour from "../model/tours.model.js";
import {connectDB} from "../db.js";
import User from "../model/users.model.js";

//Setup
dotenv.config();
connectDB();
const toursData = fs.readFileSync('./data/tours.json', 'utf-8');
const usersData = fs.readFileSync('./data/users.json', 'utf-8');
const parsedToursData = JSON.parse(toursData);
const parsedUsersData = JSON.parse(usersData);

//Import Data
const importData = async (args) => {
    let data
    if (args === "--users") {
         data = parsedUsersData
    } else if (args === "--tours") {
        data = parsedToursData
    } else {
        console.log('Missing collection argument - users /tours');
        process.exit();
    }

    try {
        await Tour.create(data); //accept array
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
        } else {
            console.log('Missing collection argument - users /tours');
            process.exit();
        }
        console.log('Data deleted...');

    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        process.exit();
    }
}

//Arguments for cli: node utils/import-dev-data.js --import/--purge  --tours/--users
if (process.argv[2] === '--import') {
    importData(process.argv[3]);

} else if (process.argv[2] === '--purge') {
    purgeCollection(process.argv[3]);
}