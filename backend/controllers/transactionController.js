import xlsx from "xlsx";
import transactionModel from "../models/transactionModel.js";
import { transactionValidationSchema } from "../validation/transactionValidation.js";

const normalizeSource  = (source)=>{
  return source.trim().toLowerCase().replace(/\b\w/g,(char)=>char.toUpperCase())
}
export const getAllTransactions = async(req,res)=>{
  try {
    const {type} = req.query
    const filter = {
      userId: req.user?.id ,
      ...(type && {type})
    }
    const transactions = await transactionModel.find(filter).sort({date:-1})
    res.status(200).json({
        success: true,
        message: `${type} fetched successfully`,
        data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
}
export const addTransaction = async(req,res)=>{
  try {
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
    res.status(201).json({
      success: true,
      message: `${type} added successfully`,
      data: newTransaction,
    });
  } catch (error) {
    if(error.name==="ValidationError"){
      return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
}
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, source, amount, date } = req.body; 

    await transactionValidationSchema.validate(req.body, { abortEarly: false });

    if (!type || !source || !amount || !date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updated = await transactionModel.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      {
        ...req.body,
        source: normalizeSource(source),
        date: new Date(date),
      },
      { new: true } /// Return updated document
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const deleteTransaction = async(req,res)=>{
  try {
    await transactionModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
}
export const downloadTransactionExcel = async(req,res)=>{
  try {
    const type = req.query.type 
    console.log(type)
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
}