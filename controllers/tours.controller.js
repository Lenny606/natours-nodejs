import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

//top level code, can be synchronous
const fileName = './data/tours.json';
const data = fs.readFileSync(fileName)
const tours = JSON.parse(data);

export const isValidId =(req, res, next, value) => {
    const params = req.params
    const tour = tours.find(tour => tour.id === parseInt(params.id));
    if (!tour) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }
    next()
}
export const checkBodyMiddleware =(req, res, next, value) => {
    if (!res.body) {
        return res.status(404).json({status: 'error', message: 'Request body is missing.'});
    }
    if (!res.body.name) {
        return res.status(404).json({status: 'error', message: 'Request name is missing.'});
    }
    if (!res.body.price) {
        return res.status(404).json({status: 'error', message: 'Request price is missing.'});
    }
    next()
}

export const getAllTours = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get tours.'});
    }
}
export const getTour = async (req, res) => {
 //has middleware to validate id => isValidId()
    try {
        res.status(200).json({
            status: 'success',
            data: tour
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get tour.'});
    }
}

export const addTour = async (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {...req.body, id: newId};
    try {
        const updatedData = JSON.stringify(tours.push(newTour));
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('Tour added successfully!');
            res.status(201).json({
                status: 'success',
                data: newTour
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to add tour.'});
    }
}
export const editTour = async (req, res) => {
    //updates tour object with new data
    tours[paramsId] = {...tour,...req.body};

    try {
        const updatedData = JSON.stringify(tours);
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('Tour edited successfully!');
            res.status(201).json({
                status: 'success',
                data: tour
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a tour.'});
    }
}

export const deleteTour = async (req, res) => {
    //deletes tour object from data
    const tours = tours.filter(tour => tour.id!== parseInt(paramsId));

    try {
        const updatedData = JSON.stringify(tours);
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('Tour edited successfully!');
            res.status(204).json({
                status: 'success',
                message: "tour deleted",
                data: null
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a tour.'});
    }
}