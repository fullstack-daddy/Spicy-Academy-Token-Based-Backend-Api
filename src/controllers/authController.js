import express from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import Student from "../models/studentModel.js";
import pendingAdmin from "../models/pendingAdminModel.js";
import Admin from "../models/adminModel.js";
import superAdmin from "../models/superAdminModel.js";
import OTP from "../models/OTP.js";
import Blacklist from "../models/blacklistModel.js";
import { formatDate } from "../utils/formatDate.js";

const app = express();
app.use(express.json());

// Student  registration
export const studentSignup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, role, otp } =
      req.body;

    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).send("Email already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Create a new student with hashed password
    const newStudent = new Student({
      username,
      email,
      firstName,
      lastName,
      password,
      role,
    });

    // Save the new user to the database
    await newStudent.save();

    const accessToken = generateAccessToken(newStudent);
    const refreshToken = generateRefreshToken(newStudent);

    res.status(201).json({
      message: "Student registered successfully",
      accessToken,
      refreshToken,
      Student_Details: {
        studentId: newStudent.studentId,
        username: newStudent.username,
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        role: newStudent.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error signing up: ${error.message}` });
  }
};

// Admin  registration
export const adminSignup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, telephone, role, otp } = req.body;

    // Check if the email already exists in either pendingAdmin or Admin collections
    const existingPendingAdminEmail = await pendingAdmin.findOne({ email });
    const existingApprovedAdminEmail = await Admin.findOne({ email });

    if (existingPendingAdminEmail || existingApprovedAdminEmail) {
      return res.status(400).send("Email already in use");
    }
    // Check if the username already exists in either pendingAdmin or Admin collections
    const existingPendingAdminUsername = await pendingAdmin.findOne({ username });
    const existingApprovedAdminUsername = await Admin.findOne({ username });

    if (existingPendingAdminUsername || existingApprovedAdminUsername) {
      return res.status(400).send("Username already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new pending admin with the hashed password
    const newPendingAdmin = new pendingAdmin({
      username,
      email,
      firstName,
      lastName,
      username,
      telephone,
      password: hashedPassword,
      role,
    });

    // Save the new user to the database
    await newPendingAdmin.save();

    const accessToken = generateAccessToken(newPendingAdmin);
    const refreshToken = generateRefreshToken(newPendingAdmin);

    res.status(201).json({
      message: "Tutor registered successfully, please await the approval of your account for onboarding",
      accessToken,
      refreshToken,
      Pending_Admin_Details: {
        adminId: newPendingAdmin._id,
        username: newPendingAdmin.username,
        email: newPendingAdmin.email,
        firstName: newPendingAdmin.firstName,
        lastName: newPendingAdmin.lastName,
        role: newPendingAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error signing up: ${error.message}` });
  }
};

// Superadmin  registration
export const superAdminSignup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, role, otp } =
      req.body;

    // Check if the email already exists
    const existingSuperAdmin = await superAdmin.findOne({ email });
    if (existingSuperAdmin) {
      return res.status(400).send("Email already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Create a new user with hashed password
    const newSuperAdmin = new superAdmin({
      username,
      email,
      firstName,
      lastName,
      password,
      role,
    });

    // Save the new user to the database
    await newSuperAdmin.save();

    const accessToken = generateAccessToken(newSuperAdmin);
    const refreshToken = generateRefreshToken(newSuperAdmin);

    res.status(201).json({
      message: "Super Admin registered successfully",
      accessToken,
      refreshToken,
      superAdmin_Details: {
        superAdminId: newSuperAdmin.superAdminId,
        username: newSuperAdmin.username,
        email: newSuperAdmin.email,
        firstName: newSuperAdmin.firstName,
        lastName: newSuperAdmin.lastName,
        role: newSuperAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error signing up: ${error.message}` });
  }
};

// Student login
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the Student exists
    const student = await Student.findOne({ email }).select("+password");

    if (!student) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(student);
    const refreshToken = generateRefreshToken(student);

    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      Student: {
        studentId: student.studentId,
        username: student.username,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        role: student.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      Admin_Details: {
        adminId: admin.adminId,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Super Admin Login
export const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the superAdmin exists
    const super_Admin = await superAdmin.findOne({ email }).select("+password");

    if (!super_Admin) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, super_Admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(super_Admin);
    const refreshToken = generateRefreshToken(super_Admin);

    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      superAdmin_Details: {
        superAdminId: super_Admin.superAdminId,
        username: super_Admin.username,
        email: super_Admin.email,
        firstName: super_Admin.firstName,
        lastName: super_Admin.lastName,
        role: super_Admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

export const getPendingAdmins = async (req, res) => {
  try {
    // Fetch all pending admins
    const pendingAdmins = await pendingAdmin.find({ status: "pending" });

    // Map through pendingAdmins to extract and format required information
    const pendingAdminsInfo = pendingAdmins.map((admin) => {
      // Combine firstName and lastName
      const fullName = `${admin.firstName} ${admin.lastName}`;

      // Format the date (assuming createdAt is the submission date)
      const submissionDate = formatDate(admin.createdAt);

      // Return the required information
      return {
        firstName: admin.firstName,
        lastName:admin.lastName,
        fullName,
        adminId: admin.adminId,
        telephone: admin.telephone,
        email: admin.email,
        password: admin.password,
        role: admin.role,
        status: admin.status,
        submissionDate,
      };
    });

    // Send the array of pending admins info
    res.status(200).json(pendingAdminsInfo);
  } catch (error) {
    console.error("Error fetching pending admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const onboardPendingAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Find the pending admin by adminId
    const pendingAdminData = await pendingAdmin.findOne({ adminId }).select('+password');

    if (!pendingAdminData) {
      return res.status(404).json({ message: "Pending admin not found" });
    }

    if (pendingAdminData.status === 'onboarded') {
      return res.status(400).json({ message: "Admin is already onboarded" });
    }

    // Create a new admin document
    const newAdmin = new Admin({
      adminId: pendingAdminData.adminId,
      firstName: pendingAdminData.firstName,
      lastName: pendingAdminData.lastName,
      telephone: pendingAdminData.telephone,
      email: pendingAdminData.email,
      password: pendingAdminData.password, 
      username: pendingAdminData.username,
      role: pendingAdminData.role,
      status: pendingAdminData.status,
    });

    // Save the new admin
    const savedAdmin = await newAdmin.save();

    // Update the pending admin's status
    pendingAdminData.status = 'onboarded';
    const pendingAdminDataSaved= await pendingAdminData.save();

    res.status(200).json({ 
      message: "Admin onboarded successfully", 
      onboarded_Admin_Details: {
        adminId: savedAdmin.adminId,
        firstName: savedAdmin.firstName,
        lastName: savedAdmin.lastName,
        email: savedAdmin.email,
        telephone: savedAdmin.telephone,
        role: savedAdmin.role,
        password: savedAdmin.password,
        status: pendingAdminDataSaved.status,
      } 
    });
  } catch (error) {
    console.error("Error onboarding admin:", error);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Email or username already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// User logout (Blacklisting the JWT)
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(204); // No content

    const token = authHeader.split(" ")[1];

    // Blacklist the token
    const newBlacklist = new Blacklist({ token });
    await newBlacklist.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
