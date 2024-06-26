// userController.js

import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import pendingAdmin from "../models/pendingAdminModel.js";
import superAdmin from "../models/superAdminModel.js";
import { formatDate } from "../utils/formatDate.js";
import multer from 'multer';
import OTP from "../models/OTP.js"

// Set up multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profilePicture');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// FInd a student
export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student by their ID
    const student = await Student.findOne({studentId});

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Extract the necessary details
    const studentDetail = {
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: `${student.firstName} ${student.lastName}`,
      email: student.email,
      dateJoined: formatDate(student.createdAt),
    };

    // Respond with the student details
    res.status(200).json(studentDetail);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};


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

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const studentId = req.user.studentId;
    const adminId = req.user.adminId;
    const superAdminId = req.user.superAdminId;
    let user, Model, idField;

    if (studentId) {
      user = await Student.findOne({ studentId }).select("+password");
      Model = Student;
      idField = "studentId";
    } else if (adminId) {
      user = await Admin.findOne({ adminId }).select("+password");
      Model = Admin;
      idField = "adminId";
    } else if (superAdminId) {
      user = await superAdmin.findOne({ superAdminId }).select("+password");
      Model = superAdmin;
      idField = "superAdminId";
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the current password is correct
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).send("Current password is incorrect");
    }

    // Check if the new password is the same as the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({message: "New password must be different from the current password"});
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password using findOneAndUpdate
    const updateQuery = { [idField]: user[idField] };
    const updateData = { password: hashedPassword };
    
    const updatedUser = await Model.findOneAndUpdate(
      updateQuery,
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(500).send("Failed to update password");
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: `Error changing password: ${error.message}` });
  }
};

// Change name (firstName, lastName, or both)
export const changeName = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const studentId = req.user.studentId;
    const adminId = req.user.adminId;
    const superAdminId = req.user.superAdminId;
    let user, Model, idField;

    if (studentId) {
      user = await Student.findOne({ studentId });
      Model = Student;
      idField = "studentId";
    } else if (adminId) {
      user = await Admin.findOne({ adminId });
      Model = Admin;
      idField = "adminId";
    } else if (superAdminId) {
      user = await superAdmin.findOne({ superAdminId });
      Model = superAdmin;
      idField = "superAdminId";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No name changes provided" });
    }

    const updatedUser = await Model.findOneAndUpdate(
      { [idField]: user[idField] },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update name" });
    }

    res.status(200).json({ 
      message: "Name updated successfully", 
      updatedName: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    });
  } catch (error) {
    console.error('Error in changeName:', error);
    res.status(500).json({ message: `Error changing name: ${error.message}` });
  }
};

// Change profile picture
export const changeProfilePicture = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err });
    }

    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const studentId = req.user.studentId;
      const adminId = req.user.adminId;
      const superAdminId = req.user.superAdminId;
      let user, Model, idField;

      if (studentId) {
        user = await Student.findOne({ studentId });
        Model = Student;
        idField = "studentId";
      } else if (adminId) {
        user = await Admin.findOne({ adminId });
        Model = Admin;
        idField = "adminId";
      } else if (superAdminId) {
        user = await superAdmin.findOne({ superAdminId });
        Model = superAdmin;
        idField = "superAdminId";
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await Model.findOneAndUpdate(
        { [idField]: user[idField] },
        { 
          profilePicture: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update profile picture" });
      }

      res.status(200).json({ 
        message: "Profile picture updated successfully"
      });
    } catch (error) {
      console.error('Error in changeProfilePicture:', error);
      res.status(500).json({ message: `Error changing profile picture: ${error.message}` });
    }
  });
};

// Get profile picture
export const getProfilePicture = async (req, res) => {
  try {
    // const user = find user logic here
    if (user && user.profilePicture && user.profilePicture.data) {
      res.contentType(user.profilePicture.contentType);
      res.send(user.profilePicture.data);
    } else {
      res.status(404).send('No profile picture found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving profile picture');
  }
};

// Change email
export const changeEmail = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const role = req.user.role;

    // Check if the email already exists in either pendingAdmin or Admin collections
    const existingPendingStudentEmail = await Student.findOne({ email: newEmail });
    const existingPendingAdminEmail = await pendingAdmin.findOne({ email: newEmail });
    const existingApprovedAdminEmail = await Admin.findOne({ email: newEmail });
    const existingSuperAdminEmail = await superAdmin.findOne({ email: newEmail });

    if (existingPendingStudentEmail || existingPendingAdminEmail || existingApprovedAdminEmail || existingSuperAdminEmail) {
      return res.status(400).send("Email already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email: newEmail }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Determine the model based on the role
    let model;
    switch (role) {
      case 'student':
        model = Student;
        break;
      case 'admin':
        model = Admin;
        break;
      case 'superadmin':
        model = superAdmin;
        break;
      default:
        return res.status(400).send("Invalid role specified");
    }

    // Update the user's email
    const user = await model.findOne(model);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.email = newEmail;
    await user.save();

    res.status(200).send("Email updated successfully");
  } catch (error) {
    res.status(500).json({ message: `Error changing email: ${error.message}` });
  }
};