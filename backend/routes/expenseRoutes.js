import express from "express";
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense } from "../controllers/expenseController.js";
import userAuth from "../middleware/userAuth.js";

const expenseRouter=express.Router()

expenseRouter.get("/get",userAuth, getAllExpense);
expenseRouter.post("/add",userAuth, addExpense);
expenseRouter.delete("/:id",userAuth, deleteExpense);
expenseRouter.get("/downloadexcel",userAuth, downloadExpenseExcel)

export default expenseRouter