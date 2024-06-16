import express from "express";
import {
  studentAssignmentSubmit,
  teacherAssignmentGradingSubmit,
  getAllPendingAssignments,
  getAllReviewedAssignments,
} from "../controllers/assignmentController.js";
import {  authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/studentAssignmentSubmission/:lessonId",
  authMiddleware,
  studentAssignmentSubmit
);
router.get(
  "/getAllPendingAssignments",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAllPendingAssignments
);
router.post(
  "/teacherAssignmentGrading/:studentId/:assignmentId",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  teacherAssignmentGradingSubmit
);
router.get(
  "/getAllReviewedAssignments",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getAllReviewedAssignments
);

export default router
