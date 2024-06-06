import express from "express";
import { isAuthenticated, authorize } from "../middleware/authMiddleware.js";
import {
    addCategory,
    deleteCategory,
    updateCategory
  } from "../controllers/categoryController.js";

  const router = express.Router();

  router.post(
    "/addCategory",
    isAuthenticated,
    authorize(["admin", "superadmin"]),
    addCategory
  );
  router.put(
    "/updateCategory/:categoryId",
    isAuthenticated,
    authorize(["admin", "superadmin"]),
    updateCategory
  );
  router.delete(
    "/deleteCategory/:categoryId",
    isAuthenticated,
    authorize(["admin", "superadmin"]),
    deleteCategory
  );

  export default router;