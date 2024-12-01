import express from 'express';
import {getBase, getDetail, getOverview} from "../controllers/views.controller.js";

const viewRouter = express.Router()

viewRouter.get("/", getOverview)
viewRouter.get("/tour", getDetail)

export default viewRouter;