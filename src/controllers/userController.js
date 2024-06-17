// userController.js

import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import pendingAdmin from "../models/pendingAdminModel.js";
import superAdmin from "../models/superAdminModel.js";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    // Find all users with the role of 'student'
    const allStudents = await Student.find({ role: "student" });

    // Respond with the retrieved students
    res.status(200).json(allStudents);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    // Find all users with the role of 'admin'
    const allAdmins = await Admin.find({ role: "admin" });

    // Respond with the retrieved admins
    res.status(200).json(allAdmins);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // Find all users in the userModel
    const allStudent = await Student.find();

    // Find all users in the adminModel
    const allAdmins = await Admin.find();

    // Combine the results
    const allStudentAndAdmins = [...allStudent, ...allAdmins];

    // Respond with the retrieved users
    res.status(200).json(allStudentAndAdmins);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { superadminId } = req.user;

    // Find the superadmin
    const superadmin = await superAdmin.findOne({ superadminId, role: "superadmin" });

    if (!superadmin) {
      // If the requesting user is not a superadmin, respond with a 403 status and a message
      return res.status(403).json({ message: "Not authorized to delete admin" });
    }

    // Find the admin by ID and role in both Admin and pendingAdmin schemas
    const findAdmin = await Admin.findOne({ adminId, role: "admin" });
    const findPendingAdmin = await pendingAdmin.findOne({ adminId, role: "admin" });

    if (!findAdmin && !findPendingAdmin) {
      // If the admin is not found in either schema, respond with a 404 status and a message
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete the admin from the appropriate collection
    if (findAdmin) {
      await Admin.findOneAndDelete({ adminId, role: "admin" });
    } else if (findPendingAdmin) {
      await pendingAdmin.findOneAndDelete({ adminId, role: "admin" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete a Student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the user by ID
    const user = await Student.findOne({ studentId });

    if (!user) {
      // If the user is not found, respond with a 404 status and a message
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await Student.findOneAndDelete({ studentId });

    // Respond with a success message
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: "Internal server error" });
  }
};
