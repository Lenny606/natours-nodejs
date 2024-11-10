import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import Tour from "../model/tours.model.js";

//top level code, can be synchronous
const fileName = './data/tours.json';
const data = fs.readFileSync(fileName)
const tours = JSON.parse(data);

export const isValidId = (req, res, next, value) => {
    const params = req.params
    const tour = tours.find(tour => tour.id === parseInt(params.id));
    if (!tour) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }
    next()
}
export const checkBodyMiddleware = (req, res, next, value) => {
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
        const allTours = await Tour.find();
        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: allTours
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get tours.'});
    }
}
export const getTour = async (req, res) => {
    //has middleware to validate id => isValidId()
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: tour
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({status: 'error', message: 'Failed to get tour: '+ error});
    }
}

export const addTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: newTour
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({status: 'error', message: 'Failed to add tour: ' + error});
    }
}
export const editTour = async (req, res) => {

    try {
        //method used for PATCH request, doesnt work with PUT
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            res.status(200).json({
                status: 'success',
                data: updatedTour
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a tour: ' + error});
    }
}

export const deleteTour = async (req, res) => {
    try {
            await Tour.findByIdAndDelete(req.params.id)
            res.status(204).json({
                status: 'success',
                message: "tour " + req.params.id +" deleted",
                data: null
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a tour: ' + error});
    }
}