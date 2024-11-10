import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import Tour from "../model/tours.model.js";
import {connectDB} from "../db.js";

//Setup
dotenv.config();
connectDB();
const data = fs.readFileSync('./data/tours.json', 'utf-8');
const parsedData = JSON.parse(data);

//Import Data
const importData = async () => {
    try {
        await Tour.create(parsedData); //accept array
        console.log('Data Imported...');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        process.exit();
    }
}

//Delete All Data

const purgeCollection = async () => {
    try {
        await Tour.deleteMany(); //accept array
        console.log('Data deleted...');

    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        process.exit();
    }
}

//Arguments for cli: node utils/import-dev-data.js --import/--purge
if (process.argv[2] === '--import') {
    importData();

} else if (process.argv[2] === '--purge') {
    purgeCollection();
}