import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (user) => {
  const payload = {
    studentId: user.studentId || undefined,
    adminId: user.adminId || undefined,
    superAdminId: user.superAdminId || undefined,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
};

export const generateRefreshToken = (user) => {
  const payload = {
    studentId: user.studentId || undefined,
    adminId: user.adminId || undefined,
    superAdminId: user.superAdminId || undefined,
    role: user.role
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "1d" });
};