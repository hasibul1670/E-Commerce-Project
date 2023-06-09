import nodemailer from "nodemailer";
import { smtpPassword, smtpUserName } from "../secret";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpUserName, // generated ethereal user
    pass: smtpPassword, // generated ethereal password
  },
});

const sendEmailWithNodemailer = async (emailData: {
  email: string;
  subject: string;
  html: string;
}) => {
  try {
    const mailOptions = {
      from: smtpUserName, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };
    
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendEmailWithNodemailer;
