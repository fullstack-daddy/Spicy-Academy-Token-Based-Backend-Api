import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import levelAssessment from "../controllers/levelAssessmentController.js";

const router = express.Router();

router.post(
  "/addLevelAssessment",
  authMiddleware,
  roleMiddleware(["student"]),
  levelAssessment
);

export default router;
