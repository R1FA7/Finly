import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js'
import { getPermissionsForRole } from '../lib/permissions.js'
import userModel from '../models/userModel.js'
import { loginSchema, registerSchema } from '../validation/authValidation.js'

export async function register(req,res){
  try {

    await registerSchema.validate(req.body,{abortEarly:false})

    const {name,email,password} = req.body

    const existingUser = await userModel.findOne({email})

    if(existingUser){
      return res.status(409).json({success:false, message:'User already exists.'})
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

    return res.status(201).json({
      success: true,
      message : 'User registered successfully',
      user,
      permissions,
      access_token,
    })

  } catch (error) {
    res.status(500).json({success:false, message:error.message})
  }
}

export async function login(req,res){
  try {

    await loginSchema.validate(req.body,{abortEarly:false})

    const {email,password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
        success:false,
        message:'User not found'
      })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(400).json({
        success:false,
        message:'Incorrect password'
      })
    }
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

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      permissions,
      access_token,
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
//after 15m access token expiration it will auto create another access token
// export async function renewAccessToken(req,res){
//   try {
//     const userId = req.user?.id 
//     if(!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized"
//       })
//     }
//     const access_token = jwt.sign(
//       {id: userId},
//       process.env.JWT_SECRET,
//       {expiresIn: '15m'}
//     )
//     res.json({
//       success: true,
//       access_token
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
export async function renewAccessToken(req,res){
  try {
    console.log(req?.user?.id)
    const access_token = jwt.sign(
      {id: req?.user?.id, role: req?.user?.role},
      process.env.JWT_SECRET,
      {expiresIn:'15m'}
    );

    res.json({success:true, access_token});
  } catch (error) {
    return res.status(401).json({success:false, message:error.message});
  }
}

//we need this bcoz reacts context api's user will be gone after refreshing page
export const getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const permissions = getPermissionsForRole(user.role)

    res.status(200).json({ success: true, user, permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export async function logout(req,res){
  try{
    res.clearCookie(
      'refreshToken', {
        httpOnly:true,
        secure : process.env.NODE_ENV==='production',
        sameSite:'strict'
      }
    )

    return res.status(200).json({
      success:true,
      message:'Logged out successfully',
    })

  } catch(error){
    return res.status(500).json({
      success:false,
      message:'Logout failed' + error.message
    })
  }
}

export async function sendVerifyOtp(req, res) {
  try {
    const userId = req.user.id; // get from middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isAccountVerified) {
      return res.status(409).json({ success: false, message: "Account already verified" });//conflict
    }

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

    return res.status(200).json({ success: true, message: "OTP sent to mail", data:otp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export async function verifyEmail(req, res) {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Missing OTP' }); // Bad Request
    }

    const userId = req.user.id; // get from middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' }); // Not Found
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' }); // Bad Request
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' }); // Bad Request
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully' }); // OK
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message }); // Internal Server Error
  }
}


export async function isAuthenticated(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export async function sendResetOtp(req,res){
  const {email} = req.body
  if(!email){
    return res.status(400).json({success:false, message:'Email is required'})
  }
  try {
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).json({success:false, message:"User not found with this email"})
    }

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

    return res.status(200).json({success:true, message:" Reset password otp sent to email", data: newOtp})

  } catch (error) {
    return res.status(500).json({success:false, message:error.message})
  }
}

export async function verifyResetOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.resetOtp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  if (user.resetOtpExpireAt < Date.now()) {
    return res.status(410).json({ success: false, message: 'OTP expired' });
  }

  user.resetOtp = ""; // Clear OTP after verification
  user.resetOtpExpireAt = 0;
  await user.save();

  return res.status(200).json({ success: true, message: 'OTP verified' });
}


export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required' });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({ success: true, message: 'Password reset successful' });
}


export async function updateProfile(req,res){
  try{
    const userId = req.user?.id 
    const {name, email, password} = req.body 
    if(!userId) return res.status(403).json({
      success : false, 
      message: "Unauthorized"
    })
    const user = await userModel.findById(userId)
    if(!user) return res.status(404).json({
      success: false,
      message: "User not found"
    })
    user.name = name || user.name
    user.email = email || user.email 

    if(password && password.trim()!=="") user.password = await bcrypt.hash(password,10) 

    await user.save() 

    res.status(200).json({
      success: true,
      message:"Profile updated successfully",
      data: user,
    })
  } catch(error){
    res.status(500).json({
      success: false, 
      message: error.message
    })
  }
}