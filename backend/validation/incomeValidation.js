import * as yup from "yup"

export const incomeValidationSchema = yup.object({
  icon: yup.string().required("Icon is required"),
  source: yup.string().required("Income source is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Income amount must be positive")
    .required("Amount is required"),
  date: yup.date().optional(),
})