import express from "express"
import { getDashboardData } from "../controllers/dashboardController.js"
import userAuth from "../middleware/userAuth.js"

const dashboardRouter = express.Router() 

dashboardRouter.get("/",userAuth, getDashboardData)

export default dashboardRouter