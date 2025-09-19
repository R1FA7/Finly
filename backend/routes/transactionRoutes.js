import express from "express";
import {
  addTransaction,
  deleteTransaction,
  downloadTransactionExcel,
  getAllTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import userAuth from "../middleware/userAuth.js";

const transactionRouter=express.Router()

transactionRouter.get("/downloadexcel", userAuth, downloadTransactionExcel);
transactionRouter.get("/", userAuth, getAllTransactions);
transactionRouter.post("/", userAuth, addTransaction);
transactionRouter.put("/:id", userAuth, updateTransaction);
transactionRouter.delete("/:id", userAuth, deleteTransaction);


export default transactionRouter