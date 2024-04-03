import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
const { EMAIL, PASSWORD } = require('../env');

// Store the timestamp when OTP is generated along with the email as key
const otpTimestamps: { [email: string]: number } = {};

const sendVerificationEmail = async (req: Request, res: Response) => {
    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({ error: "User email is required" });
    }

    const currentTime = Date.now();
    
    // Check if a recent OTP was sent to this email and enforce a wait period
    if (otpTimestamps[userEmail] && currentTime - otpTimestamps[userEmail] < 3 * 60 * 1000) {
        return res.status(429).json({ error: "Please wait for 3 minutes before requesting a resend" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString(); 
    };

    const OTP = generateOTP();
    const htmlContent = `<p>Your verification code is: <strong>${OTP}</strong></p>`;

    const mailOptions = {
        from: EMAIL,
        to: userEmail,
        subject: "Here is your verification code",
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        
        // Store the current timestamp for the email
        otpTimestamps[userEmail] = currentTime;

        // Set a timeout to clear the timestamp after 10 minutes
        setTimeout(() => {
            delete otpTimestamps[userEmail];
        }, 10 * 60 * 1000);

        return res.status(201).json({
            message: "Verification email sent successfully"
        });
    } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export { sendVerificationEmail };
