import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import User from "../model/users.model.js";
import {ApiFeatures} from "../utils/apiFeatures.js";
import {catchAsync} from "../utils/catchAsync.js";
import {AppError} from "../utils/appError.js";

//top level code, can be synchronous
const fileName = './data/users.json';
const data = fs.readFileSync(fileName)
const users = JSON.parse(data);


const filterObject = (obj, fieldsArray) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (fieldsArray.includes(el)) {
            newObj[el] = obj[el]
        }
        ;
    })
    return newObj;
}

export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
    try {
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get users.'});
    }
})
export const getUser = async (req, res) => {
    const params = req.params
    const user = users.find(user => user.id === parseInt(params.id));
    if (!user) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }

    try {
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get user.'});
    }
}

export const addUser = async (req, res) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = {...req.body, id: newId};
    try {
        const updatedData = JSON.stringify(users.push(newUser));
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('User added successfully!');
            res.status(201).json({
                status: 'success',
                data: newUser
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to add user.'});
    }
}
export const editUser = async (req, res) => {
    const paramsId = req.params.id
    const user = users.find(user => user.id === parseInt(paramsId));

    if (!user) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }
    //updates user object with new data
    users[paramsId] = {...user, ...req.body};

    try {
        const updatedData = JSON.stringify(users);
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('User edited successfully!');
            res.status(201).json({
                status: 'success',
                data: user
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a user.'});
    }
}

export const deleteUser = async (req, res) => {
    const paramsId = req.params.id
    const user = users.find(user => user.id === parseInt(paramsId));

    if (!user) {
        return res.status(404).json({status: 'error', message: 'Invalid ID.'});
    }
    //deletes user object from data
    const users = users.filter(user => user.id !== parseInt(paramsId));

    try {
        const updatedData = JSON.stringify(users);
        fs.writeFile(fileName, updatedData, error => {
            if (error) throw error;
            console.log('User edited successfully!');
            res.status(204).json({
                status: 'success',
                message: "user deleted",
                data: null
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to find a user.'});
    }
}

export const updateMe = catchAsync(async (req, res, next) => {
    //if password return err
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates', 400))
    }

    //update user document
    const filteredBody = filterObject(req.body, ['password', 'passwordConfirm']);
    const userUpdated = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: userUpdated
    })
})

export const deleteMe = catchAsync(async (req, res, next) => {
    //update user document
    await User.findByIdAndDelete(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null,
        message: 'User deleted'
    })
})