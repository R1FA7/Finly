import goalModel from "../models/goalModel.js";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
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

export const getAllUsersData = async (req,res)=> {
  //see each individual users,search, filter
  //total income/expense across users
  //Most common income/expense sources
  //Grpah of weekly/monthly/yearly trends of all users
  //Total number of goals set & achieved
  //Txn logs:view who added,edited or deleted a txn
  //admin creates a message via a form, saved in a messages collection & displayed as a banner or alert on user dashboard
  //NEXT: CHATBOT(react-chatbot-kit, BotUI)
  //Help onboard new users (show how to add a transaction, explain graphs)
  //Act as a help center (FAQs, goal tips)
  //Let users ask questions like: “How much did I spend on food this month?”
  //all users
  const search = req.query.search
  try{
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
    const users = await userModel.find(query ? query : {}).select("-password")
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
    res.status(200).json({
      success: true,
      users,
      totalIncomeExpense,
      commonSources,
      breakdowns:{
        yearly:yearlyBreakdown,
        monthly: monthlyBreakdown,
        weekly: weeklyBreakdown
      },
      recentLogs
    }) 
  } catch(error){
    console.error("Error in getAllUsersData:", error);
    res.status(500).json({success:false, error: "Server error. Please try again later." });
  }
}
export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params
    let deletes =false
    const goal_delete = await goalModel.findByIdAndDelete(id)
    if(goal_delete) deletes =true
    const txns_delete = await transactionModel.findByIdAndDelete(id)
    if(txns_delete) deletes =true
    const user_delete =  await userModel.findByIdAndDelete(id)
    if(user_delete) deletes = true 
    if(!deletes) return res.status(404).json({success:false, error:"User not found"})
    res.status(200).json({success:true, message:"User deleted successfully"})
  } catch (error) {
    console.error("Delete user error",error)
    res.status(500).json({
      success:false,
      error:"Failed to delete user"
    })
  }
}

export const updateUser = async (req, res) => {
  const {id} = req.params
  try {
    const updated = await userModel.findByIdAndUpdate(id, req.body, {new: true})
    if(!updated) return res.status(404).json({ error: "User not found." })
    res.status(200).json({ success: true, message: "User updated successfully.", user: updated });

  } catch (error) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
}