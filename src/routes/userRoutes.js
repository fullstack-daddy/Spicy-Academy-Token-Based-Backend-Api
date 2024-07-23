import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getStudentDetails,
  getAllStudents,
  getAllAdmins,
  getAllUsers,
  deleteAdmin,
  deleteStudent,
  changePassword,
  changeProfilePicture,
  changeName,
  changeEmail,
  getProfilePicture,
  deleteAccount,
  generatePasswordResetToken,
  resetPassword,
} from "../controllers/userController.js";
// import { refreshToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/getStudentDetails/:studentId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getStudentDetails
);

router.get(
  "/getAllStudents",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAllStudents
);
router.get(
  "/getAllAdmins",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllAdmins
);
router.get(
  "/getAllUsers",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllUsers
);
router.get(
  "/getProfilePicture",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  getProfilePicture
);
router.delete(
  "/deleteAdmin/:adminId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  deleteAdmin
);
router.delete(
  "/deleteAccount",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  deleteAccount
);
router.delete(
  "/deleteStudent/:studentId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteStudent
);
router.put(
  "/changePassword",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  changePassword
);
router.put(
  "/changeProfilePicture",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  changeProfilePicture
);
router.put(
  "/changeName",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  changeName
);
router.put(
  "/changeEmail",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student", "admin", "superadmin"]),
  changeEmail
);
router.post(
  "/generatePasswordResetToken",
  // refreshToken,
  generatePasswordResetToken
);
router.post(
  "/resetPassword/:token",
  // refreshToken,
  resetPassword
);

export default router;
