import incomeModel from "../models/incomeModel.js"
import { createCRUDController } from "../utils/baseController.js"; //template 
import { incomeValidationSchema } from "../validation/incomeValidation.js"

export const {getAll: getAllIncome, add:addIncome, delete:deleteIncome,downloadExcel:downloadIncomeExcel} = createCRUDController(incomeModel, incomeValidationSchema)
