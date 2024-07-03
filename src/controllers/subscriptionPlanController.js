// subscriptionController.js

import subscriptionPlanModel from "../models/subscriptionPlanModel.js";
import checkPrivilege from "../middleware/checkPrivilege.js";

// Add a new subscription
export const addSubscription = [
  checkPrivilege("Create Subscription Plan"),
  async (req, res) => {
    try {
      // Determine the ID to use based on who is signed in
      const userId = req.user.adminId || req.user.superAdminId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "Admin or Super Admin ID is required" });
      }

      // Create a new Subscription object with the request body data
      // and include the adminId or superAdminId
      const newSubscription = new subscriptionPlanModel({
        ...req.body,
        adminId: userId,
      });

      // Save the new subscription to the database
      const savedSubscription = await newSubscription.save();

      // Respond with the created subscription data
      res.status(201).json({
        message: "Subscription plan Saved Successfully",
        savedSubscription,
      });
    } catch (error) {
      // Handle errors by responding with a 500 status and the error message
      res.status(500).send(error.message);
    }
  },
];

//Get all Subscription created by a Admin
export const getAllAdminSubscriptions = async (req, res) => {
  try {
    const userId = req.user.adminId || req.user.superAdminId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Admin or Super Admin ID is required" });
    }

    // Find all free courses created by the authenticated user
    const getSubscriptionPlan = await subscriptionPlanModel.find({
      adminId: userId,
    });

    // Respond with the retrieved free courses
    res.status(200).send(getSubscriptionPlan);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Delete a subscription by ID

export const deleteSubscription = [
  checkPrivilege("Delete Subscription Plan"),
  async (req, res) => {
    try {
      const { subscriptionPlanId } = req.params;
      const { adminId, superAdminId } = req.user;

      // Find the subscription by ID
      const subscription = await subscriptionPlanModel.findOne({
        subscriptionPlanId,
      });

      if (!subscription) {
        // If the subscription is not found, respond with a 404 status and a message
        return res.status(404).json({ message: "Subscription Plan not found" });
      }

      let isAdminAuthorized = false;

      // Check if the authenticated admin is the creator of the subscription plan
      if (
        subscription.adminId === adminId ||
        subscription.adminId === superAdminId
      ) {
        isAdminAuthorized = true;
      }

      // Check if the authenticated superadmin is authorized
      if (
        !isAdminAuthorized &&
        subscription.adminId !== adminId &&
        subscription.superAdminId === superAdminId
      ) {
        isAdminAuthorized = true;
      }

      if (!isAdminAuthorized) {
        // If not authorized, respond with a 403 (Forbidden) status
        return res.status(403).json({
          message: "You are not authorized to delete this subscription plan",
        });
      }

      // Delete the subscription
      await subscriptionPlanModel.findOneAndDelete({ subscriptionPlanId });

      // Respond with a success message
      res.status(200).send("Subscription Plan deleted successfully");
    } catch (error) {
      // Handle errors by responding with a 500 status and the error message
      console.error("Error deleting subscription plan:", error);
      res.status(500).send(error.message);
    }
  },
];

// Update a subscription by ID

export const updateSubscription = [
  checkPrivilege("Edit Subscription Plan"),
  async (req, res) => {
    try {
      const { subscriptionPlanId } = req.params;
      const { adminId, superAdminId } = req.user;

      // Find the subscription by ID
      const subscriptionPlan = await subscriptionPlanModel.findOne({
        subscriptionPlanId,
      });

      if (!subscriptionPlan) {
        // If the subscription is not found, respond with a 404 status and a message
        return res.status(404).json({ message: "Subscription Plan not found" });
      }

      let isAdminAuthorized = false;

      // Check if the authenticated admin is the creator of the subscription plan
      if (
        subscriptionPlan.adminId === adminId ||
        subscriptionPlan.adminId === superAdminId
      ) {
        isAdminAuthorized = true;
      }

      // Check if the authenticated superadmin is authorized
      if (
        !isAdminAuthorized &&
        subscriptionPlan.superAdminId === superAdminId
      ) {
        isAdminAuthorized = true;
      }

      if (!isAdminAuthorized) {
        // If not authorized, respond with a 403 (Forbidden) status
        return res.status(403).json({
          message: "You are not authorized to update this subscription plan",
        });
      }

      // Update the subscription
      const updatedSubscriptionPlan =
        await subscriptionPlanModel.findOneAndUpdate(
          { subscriptionPlanId },
          req.body,
          { new: true, runValidators: true }
        );

      // Respond with the updated subscription data
      res.status(200).json({
        message: "Subscription Plan Updated Successfully",
        updatedSubscriptionPlan,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        // Handle validation errors by responding with a 400 status and the error messages
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors });
      } else if (error.name === "CastError") {
        // Handle cast errors (e.g., invalid ObjectId) by responding with a 400 status and a message
        return res.status(400).json({ message: "Invalid subscription ID" });
      } else {
        // Handle other errors by responding with a 500 status and a message
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  },
];
