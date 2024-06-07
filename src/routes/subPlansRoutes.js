// routes/courseRoutes.js
import express from "express";
import {
  addSubscription,
  deleteSubscription,
  updateSubscription,
} from "../controllers/subscriptionPlanController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { refreshToken, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/addSubscriptionPlan",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  addSubscription
);
router.delete(
  "/deleteSubscriptionPlan/:subscriptionPlanId",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  deleteSubscription
);
router.put(
  "/updateSubscriptionPlan/:subscriptionPlanId",
  refreshToken,
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  updateSubscription
);

export default router;
