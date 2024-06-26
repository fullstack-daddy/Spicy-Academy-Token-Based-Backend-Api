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
router.delete(
  "/deleteAdmin/:adminId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  deleteAdmin
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
  roleMiddleware(["student","admin", "superadmin"]),
  changePassword
);
router.put(
  "/changeProfilePicture",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["student","admin", "superadmin"]),
  changeProfilePicture
);

export default router;
