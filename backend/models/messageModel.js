import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true, 
  },
  createdBy : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true 
  },
  targetUsers : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  ],
  createdAt: {
    type: Date, 
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low","medium","high"],
    default:"medium"
  },
  isActive: {
    type: Boolean,
    default: true,
  }
})

export default mongoose.model("message", messageSchema)