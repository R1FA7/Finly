import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import transporter from '../config/nodemailer.js'
import { getPermissionsForRole } from '../lib/permissions.js'
import messageModel from '../models/messageModel.js'
import userModel from '../models/userModel.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { loginSchema, registerSchema } from '../validation/authValidation.js'

export const register = asyncHandler(async(req,res)=> {
  await registerSchema.validate(req.body,{abortEarly:false})

  const {name,email,password} = req.body

  const existingUser = await userModel.findOne({email})

  if(existingUser){
    throw new ApiError(409, 'User already exists.')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const role="user"
  const user = await userModel.create({
    name,
    email,
    password:hashedPassword,
    role
  })

  const access_token = jwt.sign(
    {id:user._id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
  );

  const refresh_token = jwt.sign(
    {id:user._id, role: user.role},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn:'7d'}
  )
  const permissions = getPermissionsForRole(user)

  res.cookie('refreshToken', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  // try {
  //   const mailOptions = {
  //     from : process.env.GMAIL_USER,
  //     to : email,
  //     subject : 'Welcome to Finly.',
  //     text : `Welcome to the Finly. Your account has been created with email id: ${email}`
  //   }

  //   await transporter.sendMail(mailOptions)
  //   console.log('Welcome email sent to', email);
  // } catch (mailError) {
  //   console.warn('Failed to send welcome email:', mailError.message);
  // }
  const data = {user, permissions, access_token}

  const response = new ApiResponse(201, data, 'User Registered successfully' )

  return res.status(201).json(response)
})

export const login = asyncHandler(async(req,res) =>{
  await loginSchema.validate(req.body,{abortEarly:false})

  const {email,password} = req.body

  const user = await userModel.findOne({email})

  if(!user) throw new ApiError(404,'User not found')

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch) throw new ApiError(400, 'Incorrect password')
  const access_token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1m' }
  );

  const refresh_token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('refreshToken', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const permissions = getPermissionsForRole(user.role)

  const data = {user, permissions, access_token}

  const response = new ApiResponse(200, data, 'Login successful')
  return res.status(200).json(response)
})
//after 15m access token expiration it will auto create another access token
export const renewAccessToken = asyncHandler(async (req,res) => {
  if(!req.user?.id) throw new ApiError(401, "Unauthorized: user not found")

  const access_token = jwt.sign(
    {id: req?.user?.id, role: req?.user?.role},
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
  );
  const response = new ApiResponse(200, access_token, "Access token renewed successfully");
  res.status(200).json(response);
})

//we need this bcoz reacts context api's user will be gone after refreshing page
export const getUserInfo = asyncHandler(async (req, res) => {

  const user = await userModel.findById(req.user?.id).select("-password");
  if (!user) throw new ApiError(404, 'User not found')

  const permissions = getPermissionsForRole(user.role)

  const data = {user, permissions}
  const response = new ApiResponse(200,data)
  res.status(200).json(response)
})

export const logout = asyncHandler(async(req,res)=>{
  res.clearCookie(
    'refreshToken', {
      httpOnly:true,
      secure : process.env.NODE_ENV==='production',
      sameSite:'strict'
    }
  )
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
})

export const extractMessages = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized. User not found')

  //user's dismissedMessages
  const user = await userModel.findById(userId).select("dismissedMessages");
  const dismissed = Array.isArray(user?.dismissedMessages) ? user.dismissedMessages : [];
  const dismissedObjectIds = dismissed
    .filter(Boolean)
    .map((id) => (id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id)));

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const messages = await messageModel.aggregate([
    {
      $match: {
        // messages targeted to this user
        $and: [
          { isActive: true },
          //{ expiresAt: { $gte: new Date() } },
          { _id: { $nin: dismissedObjectIds } },
          { targetUsers: { $in: [userObjectId] } }
        ],
      },
    },
    {
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$priority", "low"] }, then: 1 },
              { case: { $eq: ["$priority", "medium"] }, then: 2 },
              { case: { $eq: ["$priority", "high"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },
    { $sort: { priorityOrder: -1, createdAt: -1 } }, 
  ]);

  res.status(200).json(new ApiResponse(200, messages,'Messages fetched successfully'))
})

export const dismissMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { msgId } = req.body;

  if (!userId) throw new ApiError(401,'Unauthorized. User not found')

  if (!msgId) throw new ApiError(400,'Message(msgId) is required')

  // ensure msgId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(msgId)) throw new ApiError(400,'Invalid msgId')

  const msgObjectId = new mongoose.Types.ObjectId(msgId);

  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { dismissedMessages: msgObjectId },
  });

  res.status(200).json(new ApiResponse(200, null, 'Message dismissed'));
})


export const sendVerifyOtp = asyncHandler(async(req, res)=> {
  const userId = req.user.id; 
  const user = await userModel.findById(userId);

  if (!user) throw new ApiError(404, 'User not found')

  if (user.isAccountVerified) throw new ApiError(409, 'Account already verified')

  const otp = String(Math.floor(100000 + Math.random() * 900000));

  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: "Account Verification OTP.",
    text: `Your OTP to verify your account is ${otp}`
  };
  await transporter.sendMail(mailOptions);

  res.status(200).json(new ApiResponse(200, otp, 'OTP sent to your mail'))
})


export const verifyEmail = asyncHandler(async(req, res) => {
  const { otp } = req.body;

  if (!otp) throw new ApiError(400, 'Missing OTP')

  const userId = req.user.id; 
  const user = await userModel.findById(userId);

  if (!user) throw new ApiError(404, 'User not found')

  if (user.verifyOtp === '' || user.verifyOtp !== otp) throw new ApiError(400, 'Invalid OTP')

  if (user.verifyOtpExpireAt < Date.now()) throw new ApiError(400, 'OTP expired') //Bad req

  user.isAccountVerified = true;
  user.verifyOtp = '';
  user.verifyOtpExpireAt = 0;

  await user.save();

  res.status(200).json(new ApiResponse(200,null, 'Email verified successfully'))
})


export const isAuthenticated = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) throw new ApiError(401,'Not authenticated')
  res.status(200).json(new ApiResponse(200))
})


export const sendResetOtp = asyncHandler(async(req,res)=>{
  const {email} = req.body
  if(!email) throw new ApiError(400, 'Email is required')
  const user = await userModel.findOne({email})
  if(!user) throw new ApiError(404,'User not found with this email')

  const newOtp = String(Math.floor(100000+Math.random()*900000))

  user.resetOtp = newOtp
  user.resetOtpExpireAt = Date.now() + 24*60*60*1000

  await user.save()

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: "Reset Your Password - OTP Code",
    text: `
      Hi ${user.name || ''},

      We received a request to reset your password. Use the OTP below to proceed:

      OTP: ${newOtp}

      If you did not request this, you can ignore this email.

      Thanks,  
      Your App Team
      Finly
    `,
  };

  await transporter.sendMail(mailOptions)

  res.status(200).json(new ApiResponse(200, newOtp, 'Reset password otp sent to your email'))
})

export const verifyResetOtp = asyncHandler(async (req, res) => {

  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, 'Email and OTP are required')

  const user = await userModel.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found')

  if (user.resetOtp !== otp) throw new ApiError(400, 'Invalid OTP')

  if (user.resetOtpExpireAt < Date.now()) throw new ApiError(410, 'OTP expired') 

  user.resetOtp = "";
  user.resetOtpExpireAt = 0;
  await user.save();

  res.status(200).json(new ApiResponse(200,null, 'OTP verified'))
})


export const resetPassword = asyncHandler(async(req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) throw new ApiError(400, 'Email and new password are required')

  const user = await userModel.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found')

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200,null, 'Password reset successful'))
})


export const updateProfile = asyncHandler(async (req,res)=>{
  const userId = req.user?.id 
  const {name, email, password} = req.body 
  if(!userId) throw new ApiError(403, 'Unauthorized')
  const user = await userModel.findById(userId)
  if(!user) throw new ApiError(404, 'User not found')

  user.name = name || user.name
  user.email = email || user.email 

  if(password && password.trim()!=="") user.password = await bcrypt.hash(password,10) 

  await user.save() 

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'))
})