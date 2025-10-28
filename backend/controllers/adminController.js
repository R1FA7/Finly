import goalModel from "../models/goalModel.js";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';

const extractDayKey = (d)=>{
  return d.toISOString().split("T")[0];
}
const extractMonthKey = (d) =>{
  const yr = d.getFullYear(d)
  const month = String(d.getMonth()+1).padStart(2,"0")
  return `${yr}-${month}`
}
//week, month & yearly breakdown(BD BAR)
const getFullBreakDown = async (unit) =>{
  const transactions = await transactionModel.find().select("amount date type").lean();
  const breakdown = {}

  const today = new Date()
  if(unit==="week"){//last 7days 
    const last7DaysTxns = []
    for(let i=0;i<7;i++){
      const d = new Date(today)
      d.setDate(today.getDate()-i)
      const key = extractDayKey(d)
      breakdown[key] = {income: 0, expense: 0}
      last7DaysTxns.push(key)
    }

    transactions.forEach(({amount, date, type})=>{
      const d=new Date(date)
      //d.setHours(0, 0, 0, 0)
      const key=extractDayKey(d)
      if(breakdown[key]){
        breakdown[key][type]+=amount
      }
    })

    return last7DaysTxns.map((day)=>({
      period: day, 
      ...breakdown[day],
    })).sort((a,b)=>(a.period>b.period ? 1 : -1))//it's for string won't work numercal's a-b

  }

  if(unit==="month"){//last 12 months
    const months = []
    for(let i=0;i<12;i++){
      const d = new Date(today)
      d.setMonth(today.getMonth()-i)
      const key = extractMonthKey(d)
      breakdown[key]={income: 0, expense: 0}
      months.push(key)
    }

    transactions.forEach(({amount, date, type})=>{
      const d = new Date(date)
      const key = extractMonthKey(d)
      if(breakdown[key]) breakdown[key][type]+=amount
    })

    return months.map((month)=>({
      period: month,
      ...breakdown[month]
    })).sort((a,b)=>(a.period>b.period ? 1 : -1))
  }

  if(unit==="year"){//all years found
    transactions.forEach(({amount, date, type})=>{
      const d = new Date(date)
      const key = `${d.getFullYear(d)}`
      if(!breakdown[key]) breakdown[key]={income:0, expense:0}
      breakdown[key][type]+=amount
    })
    return Object.entries(breakdown).map(([period,values])=>({period,...values})).sort((a,b)=>(a.period>b.period ? 1 : -1))

  }

  return []
}

// export const getAllUser = async(req,res)=>{
//   const search = req.query.search
//   const page = parseInt(req.query.page) || 1
//   const limit = parseInt(req.query.limit) || 5
//   const skip = (page-1)* limit 
//   try{
//     const query={}
//     if(search){
//       query.$or = [
//         {
//           name: {
//             $regex: search,
//             $options: "i"
//           },
//           email: {
//             $regex: search,
//             $options: "i"
//           }
//         }
//       ]
//     }
//     const users = await userModel.find(query).select("-password").skip(skip).limit(limit)
//     const totalUsers = await userModel.countDocuments(query)
//     res.status(200).json({
//       success: true,
//       users,
//       pagination:{
//         total: totalUsers,
//         page,
//         limit,
//         totalPages: Math.ceil(totalUsers/limit)
//       }
//     }) 
//   } catch(error){
//     console.error("Error in getting users:", error);
//     res.status(500).json({success:false, error: "Server error. Please try again later." });
//   }
// }

export const getAllUsersData = asyncHandler(async (req,res)=> {
  //all users
  const search = req.query.search
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const skip = (page-1)* limit 
  const query={}
  if(search){
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        },
        email: {
          $regex: search,
          $options: "i"
        }
      }
    ]
  }
  const users = await userModel.find(query).select("-password").skip(skip).limit(limit)
  const totalUsers = await userModel.countDocuments(query)

  //Total income/expense across users 
  const totalIncomeExpense = await transactionModel.aggregate([
    {
      $group:{
        _id:"$type",
        totalAmount: {
          $sum:"$amount"
        }
      }
    }
  ])
  //most common income/expense sources
  const commonSources = await transactionModel.aggregate([
    {
      $group: {
        _id: {
          source:"$source",
          type:"$type"
        },
        count:{$sum:1},
        totalAmount:{$sum:"$amount"}
      }
    },
    {$sort: {count:-1}},
    { $limit: 10},
  ])
  //week/month/yearly breakdown full data
  const [yearlyBreakdown, monthlyBreakdown, weeklyBreakdown] = await Promise.all([
    getFullBreakDown("year"),
    getFullBreakDown("month"),
    getFullBreakDown("week")
  ]);
  //Txn logs(recent)
  const recentLogs = await transactionModel.find().populate("userId","name email")
  //console.log(recentLogs)
  //const logs = await transactionModel.find()
  //console.log("LOGS",logs)
  const data = {
    users,
    pagination: {
      totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
    totalIncomeExpense,
    commonSources,
    breakdowns: {
      yearly: yearlyBreakdown,
      monthly: monthlyBreakdown,
      weekly: weeklyBreakdown,
    },
    recentLogs,
  };
  res.status(200).json(new ApiResponse(200, data, 'Admin data fetched successfully'))
})
export const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  let deletes =false
  const goal_delete = await goalModel.findByIdAndDelete(id)
  if(goal_delete) deletes =true
  const txns_delete = await transactionModel.findByIdAndDelete(id)
  if(txns_delete) deletes =true
  const user_delete =  await userModel.findByIdAndDelete(id)
  if(user_delete) deletes = true 
  if(!deletes) throw new ApiError(404, 'User not found')
  res.status(200).json(new ApiResponse(200,null, 'User deleted successfully'))
})

export const updateUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
  if(!user) throw new ApiError(404, 'User not found')
  res.status(200).json(new ApiResponse(200,user, 'User updated successfully'))
})