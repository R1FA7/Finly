import mongoose from "mongoose"

const incomeSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  icon:{
    type: String
  },
  source:{
    type: String,
    required: true,
  },
  amount:{
    type:Number,
    required: true,
  },
  date:{
    type: Date,
    default: Date.now
  }
},{timestamps:true})

const incomeModel = mongoose.model("Income",incomeSchema)
export default incomeModel