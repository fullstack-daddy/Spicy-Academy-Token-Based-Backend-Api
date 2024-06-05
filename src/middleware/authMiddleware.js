import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import User from "../models/studentModel.js";

// Refresh Token Middleware
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // set the new tokens in the response headers
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.setHeader("Refresh-Token", newRefreshToken);
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

// Middleware to authenticate token
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No token provided, authorization denied" });
    }

    const [bearer, accessToken] = authHeader.split(" ");
    if (bearer !== "Bearer" || !accessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid Token Format" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Token verification failed" });
    }

    // Check if token is expired
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      const { accessToken: newAccessToken } = await refreshToken(req, res); // Refresh the access token
      req.accessToken = newAccessToken; // Store the new access token in the request object
    }

    // Set user object on request
    req.user = decoded;
    next();
  } catch (error) {
    // Handle specific errors from jwt.verify
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    // Handle other errors
    res.status(401).json({ error: "Token verification failed" });
  }
};

export default { authMiddleware };
