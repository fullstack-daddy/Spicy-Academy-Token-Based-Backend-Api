import express from "express";
import {
  studentLogin,
  adminLogin,
  superAdminLogin,
  logout,
  studentSignup,
  adminSignup,
  getPendingAdmins,
  onboardPendingAdmin,
  superAdminSignup,
} from "../controllers/authController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { refreshToken, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/studentLogin", studentLogin);
router.post("/adminLogin", adminLogin);
router.post("/superAdminLogin", superAdminLogin);
router.get("/logout",authMiddleware, logout);
router.post("/studentSignup", studentSignup);
router.post("/adminSignup", adminSignup);
router.get(
  "/getPendingAdmins",
  refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getPendingAdmins
);
router.post(
  "/onboardPendingAdmin:/adminId",
  refreshToken,
  authMiddleware,
  roleMiddleware(["superadmin"]),
  onboardPendingAdmin
);
router.post("/superAdminSignup", superAdminSignup);

export default router;
