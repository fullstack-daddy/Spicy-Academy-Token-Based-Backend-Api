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
import roleMiddleware from "../middleware/roleMiddleware.js";
import { refreshToken, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/addFreeCourse",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  addFreeCourse
);
router.post(
  "/addShopperCourse",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  addShopperCourse
);
router.get(
  "/freeCourses",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAdminFreeCourses
);
router.get(
  "/shopperCourses",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAdminShopperCourses
);
router.put(
  "/updateAdminFreeCourse/:freeCourseId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  updateAdminFreeCourse
);
router.put(
  "/updateAdminShopperCourse/:shopperCourseId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  updateAdminShopperCourse
);
router.delete(
  "/deleteFreeCourse/:freeCourseId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteFreeCourse
);
router.delete(
  "/deleteShopperCourse/:shopperCourseId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteShopperCourse
);

export default router;
