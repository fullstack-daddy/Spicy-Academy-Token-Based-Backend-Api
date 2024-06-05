import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";
import studentModel from "../models/studentModel.js";
import adminModel from "../models/adminModel.js";
import superAdminModel from "../models/superAdminModel.js";

const checkUserExists = async (email) => {
  const student = await studentModel.findOne({ email });
  if (student) return true;

  const admin = await adminModel.findOne({ email });
  if (admin) return true;

  const superAdmin = await superAdminModel.findOne({ email });
  if (superAdmin) return true;

  return false;
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user is already registered
    const userExists = await checkUserExists(email);

    if (userExists) {
      return res.status(400).send("User is already registered");
    }

    // Generate a 6-digit numeric OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Ensure the OTP is unique
    let existingOtp = await OTP.findOne({ otp });
    while (existingOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      existingOtp = await OTP.findOne({ otp });
    }

    // Save the OTP in the database
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    // Respond to the client
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const userExists = await checkUserExists(email);

    if (!userExists) {
      return res.status(400).send("User not registered");
    }

    // Generate a new OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Ensure the OTP is unique
    let existingOtp = await OTP.findOne({ otp });
    while (existingOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      existingOtp = await OTP.findOne({ otp });
    }

    // Update the OTP in the database
    await OTP.findOneAndUpdate({ email }, { otp });

    // Respond to the client
    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { sendOTP, resendOTP };
