import nodemailer from 'nodemailer';

const transporter1 = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525, //587,
  secure:false,
  auth:{
    user: process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
  }
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default transporter