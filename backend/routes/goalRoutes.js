import express from 'express';
import { createGoal } from '../controllers/goalController.js';
import userAuth from "../middleware/userAuth.js";

const goalRouter = express.Router()

goalRouter.post("/", userAuth('goal.manage'), createGoal)

export default goalRouter