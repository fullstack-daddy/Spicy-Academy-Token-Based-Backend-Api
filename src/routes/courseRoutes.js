// routes/courseRoutes.js
import express from "express";
import {
  getAdminFreeCourses,
  getAdminShopperCourses,
  addFreeCourse,
  addShopperCourse,
  updateAdminFreeCourse,
  updateAdminShopperCourse,
  deleteFreeCourse,
  deleteShopperCourse,
} from "../controllers/courseController.js";
import { isAuthenticated, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/addFreeCourse",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  addFreeCourse
);
router.post(
  "/addShopperCourse",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  addShopperCourse
);
router.get(
  "/freeCourses",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  getAdminFreeCourses
);
router.get(
  "/shopperCourses",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  getAdminShopperCourses
);
router.put(
  "/updateAdminFreeCourse/:freeCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  updateAdminFreeCourse
);
router.put(
  "/updateAdminShopperCourse/:shopperCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  updateAdminShopperCourse
);
router.delete(
  "/deleteFreeCourse/:freeCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  deleteFreeCourse
);
router.delete(
  "/deleteShopperCourse/:shopperCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  deleteShopperCourse
);

export default router;
