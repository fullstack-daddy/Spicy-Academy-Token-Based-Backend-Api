// routes/courseRoutes.js
import express from "express";
import {
  getAdminFreeCourses,
  getAdminShopperCourses,
  addFreeCourse,
  addShopperCourse,
  updateFreeCourse,
  updateShopperCourse,
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
  "/updateFreeCourse/:freeCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  updateFreeCourse
);
router.put(
  "/updateShopperCourse/:shopperCourseId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  updateShopperCourse
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
