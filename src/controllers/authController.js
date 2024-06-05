import express from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import superAdmin from "../models/superAdminModel.js";
import OTP from "../models/OTP.js";
import Blacklist from "../models/blacklistModel.js";

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
    const { username, firstName, lastName, email, password, role, otp } =
      req.body;

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send("Email already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Create a new user with hashed password
    const newAdmin = new Admin({
      username,
      email,
      firstName,
      lastName,
      password,
      role,
    });

    // Save the new user to the database
    await newAdmin.save();

    const accessToken = generateAccessToken(newAdmin);
    const refreshToken = generateRefreshToken(newAdmin);

    res.status(201).json({
      message: "Admin registered successfully",
      accessToken,
      refreshToken,
      Admin_Details: {
        adminId: newAdmin.adminId,
        username: newAdmin.username,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: newAdmin.role,
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
