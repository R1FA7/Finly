import express from "express";
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome } from "../controllers/incomeController.js";
import userAuth from "../middleware/userAuth.js";

const incomeRouter=express.Router()

incomeRouter.get("/get",userAuth, getAllIncome);
incomeRouter.post("/add",userAuth, addIncome);
incomeRouter.delete("/:id",userAuth, deleteIncome);
incomeRouter.get("/downloadexcel",userAuth, downloadIncomeExcel)
export default incomeRouter