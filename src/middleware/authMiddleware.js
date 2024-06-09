import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";
import superAdmin from "../models/superAdminModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Token Refresh Route Handler
export const handleTokenRefresh = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: "Invalid Authorization header format. It should be 'Bearer [token]'" });
    }

    const refreshToken = authHeader.split(" ")[1];
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Refresh token has expired" });
      }
      return res.status(401).json({ message: "Invalid refresh token: " + jwtError.message });
    }

    let user;
    switch (decoded.role) {
      case "student":
        user = await Student.findOne({ studentId: decoded.studentId });
        break;
      case "admin":
        user = await Admin.findOne({ adminId: decoded.adminId });
        break;
      case "superadmin":
        user = await superAdmin.findOne({ superAdminId: decoded.superAdminId });
        break;
      default:
        return res.status(400).json({ message: "Invalid user role in token" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
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
    req.user = decoded;
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