import goalModel from "../models/goalModel.js";
export const createGoal = async(req,res)=>{
  try {
    const userId = req.user?.id 
    const {type, startDate, endDate, amount} = req.body 

    const goal = await goalModel.create({
      userId,
      type,
      startDate,
      endDate,
      amount
    })

    res.status(201).json({
      success: true,
      message: "Goal updated successfullly",
      data: goal,
    })
  } catch (error) {
    console.error("goal creation error",error)
    res.status(500).json({
      success: false,
      message: "server error"
    })
  }
}