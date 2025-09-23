import express from 'express';
import { createGoal } from '../controllers/goalController.js';
import userAuth from "../middleware/userAuth.js";

const goalRouter = express.Router()

goalRouter.post("/", userAuth, createGoal)

export default goalRouter