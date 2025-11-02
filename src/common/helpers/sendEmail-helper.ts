import * as nodemailer from "nodemailer"

export const sendEmail = async (mailOptions:nodemailer.SendMailOptions)=>{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions)
}