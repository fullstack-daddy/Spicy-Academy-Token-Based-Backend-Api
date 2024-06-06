import express from "express";
import {
  studentAssignmentSubmit,
  teacherAssignmentGradingSubmit,getAllCourseAssignments
} from "../controllers/assignmentController.js";
import { isAuthenticated, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/studentAssignmentSubmission",
  isAuthenticated,
  studentAssignmentSubmit
);
router.get(
  "/allAssignments",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  getAllCourseAssignments
);
router.put(
  "/teacherAssignmentGrading/:assignmentId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  teacherAssignmentGradingSubmit
);
