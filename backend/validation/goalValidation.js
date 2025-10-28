import * as yup from 'yup'

export const goalValidationSchema = yup.object({
    type: yup.string().oneOf(['income','expense']).required("Goal type is required"),

    startDate: yup.date().required("Start date is required"),

    endDate: yup.date().min(yup.ref('startDate'), 'End date must be after start date').required('End date is required'),

    amount: yup.number().positive('Amount must be greater than 0').required('Amount is required')
})