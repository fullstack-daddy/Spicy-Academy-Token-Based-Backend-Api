import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 30, // The document will be automatically deleted after 30 minutes of its creation time
  },
});

const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Spicy Guitar Academy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }
        .header {
            background-color: #E44D26; /* A spicy color for Spicy Guitar Academy */
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Spicy Guitar Academy</h1>
        </div>
        <h2>OTP Verification</h2>
        <p>Welcome onboard, future guitar maestro!</p>
        <p>To complete your account registration, please use the verification code below:</p>
        <div class="otp-code">${otp}</div>
        <p>Enter this code on our website to verify your email address and activate your account.</p>
        <p>This code will expire in 30 minutes for security reasons.</p>
        <p>We can't wait to have you fully onboard, champ! Get ready to rock!</p>
        <p>If you didn't request this code, please ignore this email.</p>
    </div>
    <div class="footer">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>&copy; 2023 Spicy Guitar Academy. All rights reserved.</p>
    </div>
</body>
</html>
`;

// Function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verify Your Email - Spicy Guitar Academy",
      otpEmailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export default mongoose.model("OTP", otpSchema);