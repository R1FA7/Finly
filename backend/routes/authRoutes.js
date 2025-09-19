import express from "express";
import { getUserInfo, isAuthenticated, login, logout, register, renewAccessToken, resetPassword, sendResetOtp, sendVerifyOtp, updateProfile, verifyEmail, verifyResetOtp } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router()

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/refresh-token',userAuth, renewAccessToken)
authRouter.get('/getUserInfo',userAuth, getUserInfo)
authRouter.patch('/update-profile',userAuth, updateProfile)
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp)
authRouter.post('/verify-account',userAuth,verifyEmail)
authRouter.post('/is-auth',userAuth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/verify-reset-otp', verifyResetOtp)
authRouter.post('/reset-password',resetPassword)

export default authRouter