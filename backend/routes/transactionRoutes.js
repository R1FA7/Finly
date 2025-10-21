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

transactionRouter.get("/downloadexcel", userAuth("transaction.download"), downloadTransactionExcel);
transactionRouter.get("/", userAuth("transaction.view"), getAllTransactions);
transactionRouter.post("/", userAuth("transaction.create"), addTransaction);
transactionRouter.put("/:id", userAuth("transaction.edit"), updateTransaction);
transactionRouter.delete("/:id", userAuth("transaction.delete"), deleteTransaction);


export default transactionRouter