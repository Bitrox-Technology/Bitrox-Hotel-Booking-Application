import { sendEmail } from "../utils/mail.js"; 
const sendOtp = async(to, code) =>{
    const subject ="Verify Your Account - Hotel Booking Website";;
    let html =  `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Hotel Booking Website Verification</h2>
        <p>Dear Valued Customer,</p>
        <p>Thank you for registering with our hotel booking website. To complete your registration, please use the following One Time Password (OTP) to verify your account:</p>
        <div style="padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px; font-size: 18px; margin: 20px 0;">
            <strong>${code}</strong>
        </div>
        <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
        <p>If you did not request this email, please ignore it. Your account will remain secure.</p>
        <p>Best Regards,<br>The E-Commerce Team</p>
        <hr>
        <p style="font-size: 12px; color: #888;">If you have any questions, please contact our support team at unofficialashish279@gmail.com.</p>
    </div>`;;
    await sendEmail(to, subject, html)
}

export {
    sendOtp
}