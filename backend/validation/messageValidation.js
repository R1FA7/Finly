import * as yup from 'yup'

export const messageValidationSchema = yup.object({
  title: yup.string(),
  content: yup.string().required("text is required"),
  createdBy: yup.string().required("CreatedBy is required"),
  targetUsers: yup.array().optional(),
  expiresAt: yup.date().min(new Date()).optional(),
  priority: yup.string().oneOf(["low","medium","high"]).optional(),
  isActive: yup.boolean().optional()

})