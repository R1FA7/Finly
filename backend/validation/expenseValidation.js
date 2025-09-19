import * as yup from "yup"

export const expenseValidationSchema = yup.object({
  icon: yup.string().required("Icon is required"),
  source: yup.string().required("Expense source is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Expense amount must be positive")
    .required("Amount is required"),
  date: yup.date().optional(),
})