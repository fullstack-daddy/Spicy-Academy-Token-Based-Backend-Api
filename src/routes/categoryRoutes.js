import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {  authMiddleware } from "../middleware/authMiddleware.js";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/addCategory",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  addCategory
);
router.put(
  "/updateCategory/:categoryId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  updateCategory
);
router.delete(
  "/deleteCategory/:categoryId",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteCategory
);

export default router;
