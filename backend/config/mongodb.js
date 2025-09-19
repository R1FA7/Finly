import mongoose from "mongoose";

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("DB connected")
  } catch(err){
    console.log("DB connection failed ",err.message)
  }
}
export default connectDB