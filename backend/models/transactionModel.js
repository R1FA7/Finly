import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  icon:{
    type: String,
    required: false,
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

const transactionModel = mongoose.model("transaction",transactionSchema)
export default transactionModel