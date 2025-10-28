import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import express from "express"
import connectDB from "./config/mongodb.js"
import { errorHandler } from "./middleware/errorHandler.js"
import adminRouter from "./routes/adminRoutes.js"
import authRouter from "./routes/authRoutes.js"
import chatbotRouter from "./routes/chatbotRoutes.js"
import dashboardRouter from "./routes/dashboardRoutes.js"
import goalRouter from "./routes/goalRoutes.js"
import transactionRouter from "./routes/transactionRoutes.js"

connectDB() 

const app = express()
const port = process.env.PORT || 3000
const allowedOrigins =[
  // 'http://localhost:5173',
  // "https://finly-production-79f0.up.railway.app",
  process.env.VITE_FRONTEND_URL
]

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials:true}))


app.get('/',(req,res)=>{
  res.send("YUP")
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/goal', goalRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/chatbot',chatbotRouter)

app.use(errorHandler)

app.listen(port, ()=>{
  console.log(`server started in Port ${port}`)
})

