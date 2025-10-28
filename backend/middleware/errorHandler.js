import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next)=> {
  console.error('Error caught in error middleware', err)

  if(err.name==='ValidationError' && err.inner){
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.inner.map(e=>e.message)
    })
  }

  if(err instanceof ApiError){
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors
    })
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: []
  })
}