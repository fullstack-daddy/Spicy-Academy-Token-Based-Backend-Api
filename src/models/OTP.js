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

// Function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Spicy Guitar Academy",
      `<h1>OTP Verification</h1>
         <h3>Welcome onboard !</h3>
         <p>To complete your account registration, please verify your email with this code below:</p><br/>
         <b>OTP code: ${otp}</b>
         <p>We can't wait to have you fully onboard champ!!!</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
export default mongoose.model("OTP", otpSchema);
