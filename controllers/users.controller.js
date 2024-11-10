import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

//top level code, can be synchronous
const fileName = './data/users.json';
const data = fs.readFileSync(fileName)
const users = JSON.parse(data);

export const getAllUsers = async (req, res) => {
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
}
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
    users[paramsId] = {...user,...req.body};

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
    const users = users.filter(user => user.id!== parseInt(paramsId));

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