// routes/LessonRoutes.js
import express from "express";
import {
    addCourseLesson,
    getAdminFreeLessons,
    getAdminShopperLessons,
    getAllAdminLessons,
    updateAdminLesson,
    deleteLesson
} from "../controllers/lessonController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import  {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/addCourseLesson",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  addCourseLesson
);
router.get(
  "/getAdminFreeLessons",
  // refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAdminFreeLessons
);
router.get(
  "/getAdminShopperLessons",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAdminShopperLessons
);
router.get(
  "/getAllAdminLessons",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAllAdminLessons
);
router.put(
  "/updateAdminLesson/:lessonId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  updateAdminLesson
);
router.delete(
  "/deleteLesson/:lessonId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteLesson
);

export default router;
