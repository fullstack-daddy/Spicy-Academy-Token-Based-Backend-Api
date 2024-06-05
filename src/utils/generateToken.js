import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (user) => {
  const payload = {
    id: user.userId,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
  const payload = {
    id: user.userId,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '6h' });
};
