import messageModel from "../models/messageModel.js";
import { messageValidationSchema } from "../validation/messageValidation.js";

export const createMessage = async(req,res)=>{
  try {

    const validatedData = await messageValidationSchema.validate(req.body,{
      abortEarly: true,
    })
    validatedData.createdBy=req.user.id
    validatedData.isActive = true 
    
    const newMessage = await messageModel.create(validatedData)
    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        errors: error.errors, 
      });
    }
    console.error("Create message error:", error);
    res.status(500).json({ success: false, error: "Failed to create message" });
  }
}

export const getAdminMessages = async(req,res)=>{
  console.log("➡️ getAdminMessages triggered");
  try {
    const messages = (await messageModel.find().populate("createdBy","name email").populate("targetUsers","name email")).sort((a,b)=>b.isActive-a.isActive)
    //const messages = await messageModel.find({})
    console.log(messages)

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });

  } catch (error) {
    console.error("Fetch admin messages error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
}

export const deactivateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messageModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!message) return res.status(404).json({ success:false, error: "Message not found" });

    res.status(200).json({success:true, message: "Message deactivated", data: message });
  } catch (err) {
    console.error("Deactivate message error:", err);
    res.status(500).json({success:false, error: "Failed to deactivate message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messageModel.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ success:false, error: "Message not found" });

    res.status(200).json({success:true, message: "Message deleted", data: message });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({success:false, error: "Failed to delete message" });
  }
};
