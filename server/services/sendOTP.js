import { sendEmail } from "../utils/mail.js"; 

const sendOtp = async (to, code) => {
    const subject = "Verify Your Account - Hotel Booking Website";
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h1 style="text-align: center; color: #1a73e8; margin-bottom: 20px;">Welcome to Hotel Booking</h1>
            <p style="font-size: 16px;">Dear Valued Customer,</p>
            <p style="font-size: 16px;">
                Thank you for choosing our Hotel Booking service! To verify your account and complete the registration process, please use the One-Time Password (OTP) below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; padding: 15px 30px; font-size: 20px; color: #fff; background-color: #1a73e8; border-radius: 5px; font-weight: bold;">${code}</span>
            </div>
            <p style="font-size: 16px;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
            <p style="font-size: 16px;">
                If you did not request this email, no action is needed. Your account remains secure.
            </p>
            <p style="font-size: 16px;">Happy booking!</p>
            <p style="font-size: 16px;">Best Regards,<br>The Hotel Booking Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; text-align: center; color: #555;">
                Need help? Contact us at 
                <a href="mailto:unofficialashish279@gmail.com" style="color: #1a73e8; text-decoration: none;">unofficialashish279@gmail.com</a>.
            </p>
        </div>
    </div>
    `;
    await sendEmail(to, subject, html);
};

export {
    sendOtp
};



// import jwt from "jsonwebtoken";
// import User from "../models/User"; // Adjust to your User model

// const registerUser = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Create a new user
//         const user = new User({ email, password });
//         await user.save();

//         // Generate a unique verification token
//         const token = jwt.sign({ userId: user._id }, process.env.VERIFICATION_SECRET, { expiresIn: "1d" });

//         // Create the verification link
//         const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${token}`;

//         // Send the email
//         const subject = "Verify Your Account - Hotel Booking Website";
//         const html = `
//             <div>
//                 <p>Thank you for registering!</p>
//                 <p>Please click the link below to verify your account:</p>
//                 <a href="${verificationLink}" style="color: #1a73e8; text-decoration: none;">Verify My Account</a>
//                 <p>If you did not sign up, you can safely ignore this email.</p>
//             </div>
//         `;
//         await sendEmail(email, subject, html);

//         res.status(201).json({ message: "User registered! Please check your email to verify your account." });
//     } catch (error) {
//         next(error);
//     }
// };
