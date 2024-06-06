// routes/courseRoutes.js
import express from "express";
import {
  addSubscription,
  deleteSubscription,
  updateSubscription,
} from "../controllers/subscriptionPlanController.js";
import { isAuthenticated, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/addSubscriptionPlan",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  addSubscription
);
router.delete(
  "/deleteSubscriptionPlan/:subscriptionId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  deleteSubscription
);
router.put(
  "/updateSubscriptionPlan/:subscriptionId",
  isAuthenticated,
  authorize(["admin", "superadmin"]),
  updateSubscription
);

export default router;
