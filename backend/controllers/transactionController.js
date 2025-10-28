import xlsx from "xlsx";
import transactionModel from "../models/transactionModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { transactionValidationSchema } from "../validation/transactionValidation.js";

const normalizeSource  = (source)=>{
  return source.trim().toLowerCase().replace(/\b\w/g,(char)=>char.toUpperCase())
}
export const getAllTransactions = asyncHandler(async(req,res)=>{
  const {type} = req.query
  const filter = {
    userId: req.user?.id ,
    ...(type && {type})
  }
  const transactions = await transactionModel.find(filter).sort({date:-1})
  res.status(200).json(new ApiResponse(200, transactions, `${type} data fetched successfully`))
})
export const addTransaction = asyncHandler(async(req,res)=>{
  await transactionValidationSchema.validate(req.body,{abortEarly:false})

  const {type, icon, source, amount, date} = req.body
  const newTransaction = await transactionModel.create({
    userId : req.user?.id,
    type,
    icon,
    source : normalizeSource(source),
    amount,
    date: new Date(date)
  })
  res.status(201).json(new ApiResponse(201,newTransaction,`${type} added successfully`))
})
export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, source, amount, date } = req.body; 

  await transactionValidationSchema.validate(req.body, { abortEarly: false });

  if (!type || !source || !amount || !date) throw new ApiError(400, 'Some fields are missing.')

  const updated = await transactionModel.findOneAndUpdate(
    { _id: id, userId: req.user?.id },
    {
      ...req.body,
      source: normalizeSource(source),
      date: new Date(date),
    },
    { new: true }
  );

  if (!updated) throw new ApiError(404, 'Transaction not found.')

  res.status(200).json(new ApiResponse(200, updated, 'Transaction updated successfully'))
})


export const deleteTransaction = asyncHandler(async(req,res)=>{
  const deleted = await transactionModel.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
  if (!deleted) throw new ApiError(404, 'Transaction not found');
  res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));

})
export const downloadTransactionExcel = asyncHandler(async(req,res)=>{
  const type = req.query.type 
  const filter = {
    userId: req.user?.id,
    type: type,
  }
  const transactions = await transactionModel.find(filter).sort({date:-1})
  const formatted = transactions.map((t) => ({
      Source: t.source,
      Amount: t.amount,
      Date: t.date,
  }));

  const ws = xlsx.utils.json_to_sheet(formatted);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Data");

  const filename = `${type.toLowerCase()}_details.xlsx`;
  xlsx.writeFile(wb, filename);
  res.download(filename);
})