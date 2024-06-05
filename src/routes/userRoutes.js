import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllStudents,
  getAllAdmins,
  getAllUsers,
  deleteAdmin,
  deleteUser,
} from "../controllers/userController.js";
import { refreshToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get(
  "/getAllStudents",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin, superadmin"]),
  getAllStudents
);
router.get(
  "/getAllAdmins",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllAdmins
);
router.get(
  "/getAllUsers",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllUsers
);
router.delete(
  "/deleteAdmin/:adminId",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteAdmin
);
router.delete(
  "/deleteUser/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteUser
);

export default router;
