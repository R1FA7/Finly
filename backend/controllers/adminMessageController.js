import messageModel from "../models/messageModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { messageValidationSchema } from "../validation/messageValidation.js";

export const createMessage = asyncHandler(async(req,res)=>{
  const validatedData = await messageValidationSchema.validate(req.body,{
    abortEarly: true,
  })
  validatedData.createdBy=req.user.id
  validatedData.isActive = true 
  
  const newMessage = await messageModel.create(validatedData)
  res.status(201).json(new ApiResponse(201,newMessage,'Message created successfully'))
})

export const getAdminMessages = asyncHandler(async(req,res)=>{
  const messages = (await messageModel.find().populate("createdBy","name email").populate("targetUsers","name email")).sort((a,b)=>b.isActive-a.isActive)
  //const messages = await messageModel.find({})
  console.log(messages)
  res.status(200).json(new ApiResponse(200, messages, 'Messages fetched successfully'))
})

export const deactivateMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await messageModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!message) throw new ApiError(404, 'Message not found')
  res.status(200).json(new ApiResponse(200, message, 'Message deactivated'))
})

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await messageModel.findByIdAndDelete(id);
  if (!message) throw new ApiError(404, 'Message not found')

  res.status(200).json(new ApiResponse(200, message, 'Message deleted successfully'))
})
