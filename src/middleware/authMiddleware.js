import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import superAdmin from "../models/superAdminModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Refresh Token Middleware
export const refreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: "Invalid Authorization header format. It should be 'Bearer [token]'" });
    }

    const refreshToken = authHeader.split(" ")[1];
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

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
    req.newAccessToken = newAccessToken;
    req.newRefreshToken = newRefreshToken;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Refresh token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid refresh token: " + error.message });
    }
    // Handle other errors
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

// Middleware to authenticate token
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Invalid Authorization header format. It should be 'Bearer [token]'" });
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET);

    // Check if token is about to expire (e.g., within the next minute)
    if (decoded.exp - Math.floor(Date.now() / 1000) <= 60) {
      // If token is about to expire, use the new access token if available
      if (req.newAccessToken) {
        req.user = jwt.decode(req.newAccessToken);
      } else {
        // If no new token, proceed with the current one
        req.user = decoded;
      }
    } else {
      req.user = decoded;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Access token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid access token: " + error.message });
    }
    // Handle other errors
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

export default { authMiddleware };
