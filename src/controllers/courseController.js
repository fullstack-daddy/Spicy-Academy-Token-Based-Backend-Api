// courseController.js

import freeCourseModel from "../models/freeCourseModel.js";
import shopperCourseModel from "../models/shopperCourseModel.js";

// Add a new free course
export const addFreeCourse = async (req, res) => {
  try {
    // Create a new FreeCourse object with the request body data and the admin ID from the authenticated user
    const newFreeCourse = new freeCourseModel({
      ...req.body,
      adminId: req.user.adminId,
    });

    // Save the new free course to the database
    const savedFreeCourse = await newFreeCourse.save();
    
    // Respond with the created free course data
    res.status(201).json(savedFreeCourse);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Add a new shopper course
export const addShopperCourse = async (req, res) => {
  try {
    // Create a new ShopperCourse object with the request body data and the admin ID from the authenticated user
    const newShopperCourse = new shopperCourseModel({
      ...req.body,
      adminId: req.user.adminId,
    });
    
    // Save the new shopper course to the database
    const savedShopperCourse = await newShopperCourse.save();
    
    // Respond with the created shopper course data
    res.status(201).json(savedShopperCourse);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Retrieve all free courses for the authenticated user
export const getFreeCourses = async (req, res) => {
  try {
    // Find all free courses created by the authenticated user
    const freeCourses = await freeCourseModel.find({ adminId: req.user.userId });
    
    // Respond with the retrieved free courses
    res.status(200).send(freeCourses);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Retrieve all shopper courses for the authenticated user
export const getShopperCourses = async (req, res) => {
  try {
    // Find all shopper courses created by the authenticated user
    const shopperCourses = await shopperCourseModel.find({ adminId: req.user.userId });
    
    // Respond with the retrieved shopper courses
    res.status(200).send(shopperCourses);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Update a free course
export const updateFreeCourse = async (req, res) => {
  try {
    const { freeCourseId } = req.params;

    // Find the free course by ID
    const freeCourse = await freeCourseModel.findOne({ freeCourseId });

    if (!freeCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the authenticated user is the admin who created the course
    if (freeCourse.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    // Update the free course with new data
    const updatedFreeCourse = await freeCourseModel.findOneAndUpdate(
      { freeCourseId },
      req.body,
      { new: true, runValidators: true }
    );

    // Respond with the updated free course data
    res.status(200).json(updatedFreeCourse);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: error.message });
  }
};

// Update a shopper course
export const updateShopperCourse = async (req, res) => {
  try {
    const { shopperCourseId } = req.params;

    // Find the shopper course by ID
    const shopperCourse = await shopperCourseModel.findOne({ shopperCourseId });

    if (!shopperCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the authenticated user is the admin who created the course
    if (shopperCourse.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    // Update the shopper course with new data
    const updatedShopperCourse = await shopperCourseModel.findOneAndUpdate(
      { shopperCourseId },
      req.body,
      { new: true, runValidators: true }
    );

    // Respond with the updated shopper course data
    res.status(200).json(updatedShopperCourse);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: error.message });
  }
};

// Delete a free course
export const deleteFreeCourse = async (req, res) => {
  try {
    const { freeCourseId } = req.params;

    // Find the free course by ID
    const deleteFreeCourse = await freeCourseModel.findOne({ freeCourseId });

    if (!deleteFreeCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the authenticated user is the admin who created the course
    if (deleteFreeCourse.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    // Delete the free course from the database
    await freeCourseModel.findOneAndDelete({ freeCourseId });

    // Respond with a success message
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting free course:", error);
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a shopper course
export const deleteShopperCourse = async (req, res) => {
  try {
    const { shopperCourseId } = req.params;

    // Find the shopper course by ID
    const shopperCourse = await shopperCourseModel.findOne({ shopperCourseId });

    if (!shopperCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the authenticated user is the admin who created the course
    if (shopperCourse.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    // Delete the shopper course from the database
    await shopperCourseModel.findOneAndDelete({ shopperCourseId });

    // Respond with a success message
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting shopper course:", error);
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: "Internal server error" });
  }
};
