import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import pendingAdmin from "../models/pendingAdminModel.js";
import superAdmin from "../models/superAdminModel.js";
import crypto from 'crypto';
import {mailSender} from '../utils/mailSender.js'
import { formatDate } from "../utils/formatDate.js";
import multer from "multer";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import checkPrivilege from "../middleware/checkPrivilege.js";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'djm8kokg4',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profilePicture");

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Find a student
export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student by their ID
    const student = await Student.findOne({ studentId });

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
    // Find all students in the studentModel with the role of 'student'
    const allStudents = await Student.find({ role: "student" });

    // Count the number of students
    const studentCount = allStudents.length;

    // Respond with the retrieved students and count
    res.status(200).json({
      studentCount,
      allStudents,
    });
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    // Find all admins in the adminModel with the role of 'admin'
    const allAdmins = await Admin.find({ role: "admin" });

    // Count the number of admins
    const adminCount = allAdmins.length;

    // Respond with the retrieved admins and count
    res.status(200).json({
      adminCount,
      allAdmins,
    });
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // Find all students in the studentModel
    const allStudents = await Student.find();

    // Find all admins in the adminModel
    const allAdmins = await Admin.find();

    // Count the number of students and admins
    const studentCount = allStudents.length;
    const adminCount = allAdmins.length;

    // Respond with the retrieved users and counts
    res.status(200).json({
      studentCount,
      adminCount,
      allStudents,
      allAdmins,
    });
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
    const superadmin = await superAdmin.findOne({
      superadminId,
      role: "superadmin",
    });

    if (!superadmin) {
      // If the requesting user is not a superadmin, respond with a 403 status and a message
      return res
        .status(403)
        .json({ message: "Not authorized to delete admin" });
    }

    // Find the admin by ID and role in both Admin and pendingAdmin schemas
    const findAdmin = await Admin.findOne({ adminId, role: "admin" });
    const findPendingAdmin = await pendingAdmin.findOne({
      adminId,
      role: "admin",
    });

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

// Delete a student
export const deleteStudent = [
  checkPrivilege("Remove Student Account"),
  async (req, res) => {
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
  },
];

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
      return res
        .status(400)
        .json({
          message: "New password must be different from the current password",
        });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password using findOneAndUpdate
    const updateQuery = { [idField]: user[idField] };
    const updateData = { password: hashedPassword };

    const updatedUser = await Model.findOneAndUpdate(updateQuery, updateData, {
      new: true,
      runValidators: false,
    });

    if (!updatedUser) {
      return res.status(500).send("Failed to update password");
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res
      .status(500)
      .json({ message: `Error changing password: ${error.message}` });
  }
};

// generatePasswordResetToken
export const generatePasswordResetToken = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists (checking in Student, Admin, and superAdmin models)
    let user = await Student.findOne({ email });
    if (!user) user = await Admin.findOne({ email });
    if (!user) user = await superAdmin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token expiration (30 minutes from now)
    const resetTokenExpiration = Date.now() + 1800000; // 30 minutes

    // Save the reset token and expiration to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Create email message
    const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
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
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 15px;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, please click the button below:</p>
            <a href="${resetUrl}" class="button">Reset Your Password</a>
            <p>Or copy and paste the following link into your browser:</p>
            <p>${resetUrl}</p>
            <p><strong>This link will expire in 30 minutes.</strong></p>
            <p>If you have any issues or didn't request this password reset, please contact our support team.</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;

    // Send email
    await mailSender(user.email, 'Password Reset Request', body);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in generatePasswordResetToken:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the token exists in any of the models
    let user = await Student.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await superAdmin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set the new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password' });
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
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error("Error in changeName:", error);
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

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      const updatedUser = await Model.findOneAndUpdate(
        { [idField]: user[idField] },
        {
          profilePicture: result.secure_url,
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Failed to update profile picture" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: result.secure_url
      });
    } catch (error) {
      console.error("Error in changeProfilePicture:", error);
      res
        .status(500)
        .json({ message: `Error changing profile picture: ${error.message}` });
    }
  });
};

// Get profile picture
export const getProfilePicture = async (req, res) => {
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

    if (user.profilePicture) {
      res.status(200).json({ profilePicture: user.profilePicture });
    } else {
      res.status(404).json({ message: "No profile picture found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile picture" });
  }
};

// Change email
export const changeEmail = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const studentId = req.user.studentId;
    const adminId = req.user.adminId;
    const superAdminId = req.user.superAdminId;
    let Model, idField, userEmail;

    if (studentId) {
      Model = Student;
      idField = "studentId";
      userEmail = studentId;
    } else if (adminId) {
      Model = Admin;
      idField = "adminId";
      userEmail = adminId;
    } else if (superAdminId) {
      Model = superAdmin;
      idField = "superAdminId";
      userEmail = superAdminId;
    } else {
      return res.status(400).send("Invalid role specified");
    }

    // Check if the email already exists in any collection
    const existingEmail =
      (await Student.findOne({ email: newEmail })) ||
      (await pendingAdmin.findOne({ email: newEmail })) ||
      (await Admin.findOne({ email: newEmail })) ||
      (await superAdmin.findOne({ email: newEmail }));

    if (existingEmail) {
      return res.status(400).send("Email already in use");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email: newEmail })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).send("The OTP is not valid");
    }

    // Update the user's email
    const user = await Model.findOne({ [idField]: userEmail });
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

// Function to delete account
export const deleteAccount = async (req, res) => {
  try {
    const { password, reason } = req.body;
    const studentId = req.user.studentId;
    const adminId = req.user.adminId;
    const superAdminId = req.user.superAdminId;
    let user, Model, idField;

    // Determine the user model based on the role and ID
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
    } else {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Delete the user account
    await Model.findOneAndDelete({ [idField]: user[idField] });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    res
      .status(500)
      .json({ message: `Error deleting account: ${error.message}` });
  }
};
