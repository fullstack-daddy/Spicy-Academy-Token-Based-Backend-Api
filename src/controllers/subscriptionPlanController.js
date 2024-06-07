// subscriptionController.js

import subscriptionPlanModel from "../models/subscriptionPlanModel.js";

// Add a new subscription
export const addSubscription = async (req, res) => {
  try {

    // Create a new Subscription object with the request body data
    // and include the adminId
    const newSubscription = new subscriptionPlanModel({
      ...req.body,
      adminId: req.user.adminId,
    });

    // Save the new subscription to the database
    const savedSubscription = await newSubscription.save();

    // Respond with the created subscription data
    res.status(201).json({
      message: "Subscription plan Saved Successfully",
      savedSubscription
    });
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Delete a subscription by ID
export const deleteSubscription = async (req, res) => {
  try {
    const { subscriptionPlanId } = req.params;

    // Find the subscription by ID
    const subscription = await subscriptionPlanModel.findOne({ subscriptionPlanId });

    if (!subscription) {
      // If the subscription is not found, respond with a 404 status and a message
      return res.status(404).json({ message: 'Subscription Plan not found' });
    }

    // Check if the authenticated admin is the creator of the subscription plan
    if (subscription.adminId !== req.user.adminId) {
      // If not, respond with a 403 (Forbidden) status
      return res.status(403).json({ message: 'You are not authorized to delete this subscription plan' });
    }

    // Delete the subscription
    await subscription.remove();

    // Respond with a success message
    res.status(200).send('Subscription Plan deleted successfully');
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Update a subscription by ID
export const updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlanId } = req.params;

    // Find the subscription by ID
    const subscriptionPlan = await subscriptionPlanModel.findOne(
      { subscriptionPlanId }
    );

    if (!subscriptionPlan) {
      // If the subscription is not found, respond with a 404 status and a message
      return res.status(404).json({ message: 'Subscription Plan not found' });
    }
    // Check if the authenticated admin is the creator of the subscription plan
    if (subscriptionPlan.adminId !== req.user.adminId) {
      // If not, respond with a 403 (Forbidden) status
      return res.status(403).json({ message: 'You are not authorized to delete this subscription plan' });
    }

    // Update the subscription
    const updatedSubscriptionPlan = await subscriptionPlanModel.findOneAndUpdate(
      { subscriptionPlanId },
      req.body,
      { new: true, runValidators: true }
    );

    // Respond with the updated subscription data
    res.status(200).json({message: "Subscription Plan Updated Successfully", updatedSubscriptionPlan});
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors by responding with a 400 status and the error messages
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    } else if (error.name === 'CastError') {
      // Handle cast errors (e.g., invalid ObjectId) by responding with a 400 status and a message
      return res.status(400).json({ message: 'Invalid subscription ID' });
    } else {
      // Handle other errors by responding with a 500 status and a message
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
