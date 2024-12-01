import {AppError} from "../utils/appError.js";

export const getBase = (req, res) => {
    res.status(200).render('base', {
        tours: "Tours",
        name: "Jon Doe"
    })
}

export const getOverview = (req, res) => {
    res.status(200).render('tour', {
        title: "All Tours",
    })
}

export const getDetail = (req, res) => {
    res.status(200).render('overview', {
        title: "Tour",
    })
}