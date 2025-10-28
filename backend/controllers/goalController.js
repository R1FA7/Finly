import goalModel from "../models/goalModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { goalValidationSchema } from "../validation/goalValidation.js";

export const createGoal = asyncHandler(async(req,res)=>{
  const userId = req.user?.id 
  const {type, startDate, endDate, amount} = req.body 

  await goalValidationSchema.validate({
    type, startDate, endDate, amount
  }, {abortEarly: false })

  const goal = await goalModel.create({
    userId,
    type,
    startDate,
    endDate,
    amount
  })  

  res.status(201).json(new ApiResponse(201, goal, 'Goal created successfully'))
})