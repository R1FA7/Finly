import expenseModel from "../models/expenseModel.js";
import { createCRUDController } from "../utils/baseController.js";
import { expenseValidationSchema } from "../validation/expenseValidation.js";

export const {getAll: getAllExpense, add:addExpense, delete:deleteExpense,downloadExcel:downloadExpenseExcel} = createCRUDController(expenseModel, expenseValidationSchema)
