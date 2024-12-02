import express from 'express';
import {getAdmin, getDetail, getLoginForm, getOverview} from "../controllers/views.controller.js";

const viewRouter = express.Router()

viewRouter.get("/", getOverview)
viewRouter.get("/tour/:slug", getDetail)
viewRouter.get("/admin", getAdmin)
viewRouter.get("/login", getLoginForm)

export default viewRouter;