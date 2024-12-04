import express from 'express';
import {getAdmin, getDetail, getLoginForm, getOverview} from "../controllers/views.controller.js";
import {isLoggedIn} from "../controllers/auth.controller.js";

const viewRouter = express.Router()

//use mw for every template
viewRouter.use(isLoggedIn)

viewRouter.get("/", getOverview)
viewRouter.get("/tour/:slug", getDetail)
viewRouter.get("/admin", getAdmin)
viewRouter.get("/login", getLoginForm)

export default viewRouter;