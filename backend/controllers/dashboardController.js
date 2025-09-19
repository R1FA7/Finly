import mongoose, { isValidObjectId } from "mongoose";
import transactionModel from "../models/transactionModel.js";
//req. query, params, body

//Dashboard->TB,TI,TE,Recent txns, Only Exp, Last months exp, income last 30days , (+search bar, +breakdown bar)
//Income -> last 7 days income bar, income source, add income(new one will be added in bar), download,
//Expense-> same

const extractDayKey = (d)=>{
  return d.toISOString().split("T")[0];
}
const extractMonthKey = (d) =>{
  const yr = d.getFullYear(d)
  const month = String(d.getMonth()+1).padStart(2,"0")
  return `${yr}-${month}`
}
//week, month & yearly breakdown(BD BAR)
const getFullBreakDown = async (userId, unit) =>{
  const transactions = await transactionModel.find({userId}).select("amount date type").lean()
  const breakdown = {}

  const today = new Date()
  console.log("Date",today);
  //today.setHours(0, 0, 0, 0)
  console.log("after",today)
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

// get total income or expense from startDate(TI,TE,TB,income/exp in last x days)
const getTotalAmounts = async (userId, type, startDate=null, endDate=null)=>{
  const match={
    userId: new mongoose.Types.ObjectId(userId),
    type,
    ...(startDate && {date : {$gte: startDate}}),
    ...(endDate && {date: {$lte: endDate}})
  }

  const result = await transactionModel.aggregate([
    {$match: match},
    {$group: {_id: null, total: {$sum:"$amount"}}}
  ])

  const total =  result[0]?.total || 0;
  let txns = []
  if(startDate && endDate){
    txns = await transactionModel.find(match).sort({date:-1})
    return {txns} 
  }
  
  if(startDate){
    txns = await transactionModel.find(match).sort({date:-1})
  }
  return {
    total,
    ...(startDate && {txns})
  }
}

// export const getDashboardRangeQueryData =  async(req,res)=>{
//   try{
//     const userId = req.user?.id
//     const {startRDate, endRDate} = req.query
//     if(startRDate || !endRDate){
//       return res.status(400).json({
//         success: false,
//         message: "Date range required"
//       })
//     }
//     //Total income & expnse within this date range(another feature)
//     const {total: totalIncomeinRange} = await getTotalAmounts(
//       userId,
//       "income",
//       startRDate,
//       endRDate
//     )
//     const {total: totalExpenseinRange} = await getTotalAmounts(
//       userId,
//       "expense",
//       startRDate,
//       endRDate 
//     )
//     res.status(200).json({
//       success: true,
//       message: "Range data fetched successfully",
//       data:{
//         totalIncomeinRange,
//         totalExpenseinRange,
//       }
//     })
//   } catch(error){
//     console.error("Dashboard error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       errors: error.message,
//     });
//   }
// }

const parseDate = (dateStr) =>{
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d;
}
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }
    

    const {search="", type, source, minAmount, maxAmount, startDate, endDate} = req.query

    const baseMatch = {userId: new mongoose.Types.ObjectId(userId)}

    if(search) baseMatch.source={$regex:search, $options: "i"}

    if(type) baseMatch.type=type

    if(source) baseMatch.source=source 

    if(minAmount || maxAmount){
      baseMatch.amount={}
      if(minAmount) baseMatch.amount.$gte=Number(minAmount)
      if(maxAmount) baseMatch.amount.$lte=Number(maxAmount)

      if(Object.keys(baseMatch.amount).length===0) delete baseMatch.amount 
    }
    const parsedStartDate = parseDate(startDate)
    const parsedEndDate = parseDate(endDate)
    if(parsedStartDate || parsedEndDate){
      baseMatch.date = {}
      if(parsedStartDate) baseMatch.date.$gte = parsedStartDate
      if(parsedEndDate) baseMatch.date.$lte = parsedEndDate
    }
    
    // Total income & expense
    
    const searchFilteredTxns = await transactionModel.find(baseMatch).sort({date:-1})
    
    
    const {total:totalIncome} = await getTotalAmounts(userId, "income")
    const {total: totalExpense} = await getTotalAmounts(userId, "expense")
    const totalBalance = totalIncome - totalExpense

    //Recent(last 10) txns
    const last10Txns = await transactionModel.find({userId}).sort({date:-1}).limit(10)

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Last 7 & 30 days income/expense
    const [lastWeeksIncome, lastWeeksExpense, lastMonthsIncome, lastMonthsExpense] = await Promise.all([
      getTotalAmounts(userId, "income", last7Days),
      getTotalAmounts(userId, "expense", last7Days),
      getTotalAmounts(userId, "income", last30Days),
      getTotalAmounts(userId, "expense", last30Days)
    ]);

    // Yearly, Monthly, Weekly breakdowns
    const [yearlyBreakdown, monthlyBreakdown, weeklyBreakdown] = await Promise.all([
      getFullBreakDown(userId, "year"),
      getFullBreakDown(userId, "month"),
      getFullBreakDown(userId, "week"),
    ]);

    //sources
    const incomeSources = await transactionModel.distinct("source",{type:"income"})
    const expenseSources = await transactionModel.distinct("source",{type:"expense"})

    res.status(200).json({
      success: true,
      message: "Dashboard Data fetched successfully",
      data: {
        totalBalance,
        totalIncome,
        totalExpense,
        incomeSources,
        expenseSources,
        incomeVsExpense: {
          weekly: {
            income: lastWeeksIncome,
            expense: lastWeeksExpense,
          },
          monthly: {
            income: lastMonthsIncome,
            expense: lastMonthsExpense,
          }
        },
        recentTransactions: last10Txns,
        searchFilteredTxns,
        breakdowns: {
          yearly: yearlyBreakdown,   // For charting per year
          monthly: monthlyBreakdown, // For charting per month
          weekly: weeklyBreakdown,   // For charting per week
        },
      },
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      errors: error.message,
    });
  }
};
