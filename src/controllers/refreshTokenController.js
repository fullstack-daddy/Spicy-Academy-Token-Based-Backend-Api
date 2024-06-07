import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import superAdmin from "../models/superAdminModel.js";

export const refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
      const student = await Student.findOne({ studentId: decoded.studentId, role: "student" });
      const admin = await Admin.findOne({ adminId: decoded.adminId, role: "admin" });
      const superAdminUser = await superAdmin.findOne({ superAdminId: decoded.superAdminId, role: "superadmin" });
  
      const user = student || admin || superAdminUser;
  
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      // Set the new tokens in the response headers
      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      res.setHeader("Refresh-Token", newRefreshToken);
      res.json({newAccessToken, newRefreshToken});
      req.newAccessToken = newAccessToken;
      req.newRefreshToken = newRefreshToken;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token has expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid refresh token: " + error.message });
      }
      // Handle other errors
      res
        .status(401)
        .json({ message: "Invalid refresh token: " + error.message });
    }
  };