import express from "express";
import { getChatbotResponse } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router()

chatbotRouter.post("/", getChatbotResponse)

export default chatbotRouter