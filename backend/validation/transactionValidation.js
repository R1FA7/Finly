import * as yup from "yup"

export const transactionValidationSchema = yup.object({
  type: yup.string().required(),
  //icon: yup.string().required("Icon is required"),
  source: yup.string().required("Income source is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Income amount must be positive")
    .required("Amount is required"),
  date: yup.date().optional(),
})