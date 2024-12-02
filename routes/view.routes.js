import express from 'express';
import {getAdmin, getDetail, getOverview, protectedRoute} from "../controllers/views.controller.js";

const viewRouter = express.Router()

viewRouter.get("/", getOverview)
viewRouter.get("/tour/:slug/", getDetail)
viewRouter.get("/admin", getAdmin)

export default viewRouter;