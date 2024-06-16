// courseLessonsController.js

import courseLessons from "../models/courseLessonsModel.js";

// Add a new lesson
export const addCourseLesson = async (req, res) => {
  try {
    // Create a new courseLessons object with the request body data and the admin ID from the authenticated user
    const newLesson = new courseLessons({
      ...req.body,
      adminId: req.user.adminId,
    });

    // Save the new free course to the database
    const savedLesson = await newLesson.save();
    
    // Respond with the created free course data
    res.status(201).json({message:"Lesson Created Successfully", Lesson_Details: savedLesson});
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Retrieve all lessons for the authenticated Admin
export const getAllAdminLessons = async (req, res) => {
  try {
    // Find all Lessons created by the authenticated user
    const allLessons = await courseLessons.find({ adminId: req.user.adminId});
    
    // Respond with the retrieved free Lessons
    res.status(200).send(allLessons);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Retrieve all free lessons for the authenticated Admin
export const getAdminFreeLessons = async (req, res) => {
  try {
    // Find all free Lessons created by the authenticated user
    const freeLessons = await courseLessons.find({ adminId: req.user.adminId, lessonSubscriptionCategory: "free" });
    
    // Respond with the retrieved free Lessons
    res.status(200).send(freeLessons);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Retrieve all shopper Lessons for the authenticated Admin
export const getAdminShopperLessons = async (req, res) => {
  try {
    // Find all shopper Lessons created by the authenticated Admin
    const shopperLessons = await courseLessons.find({ adminId: req.user.adminId, lessonSubscriptionCategory: "paid" });
    
    // Respond with the retrieved shopper Lessons
    res.status(200).send(shopperLessons);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
};

// Update a free course
export const updateAdminLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Find the lesson by ID
    const lesson = await courseLessons.findOne({ lessonId });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Check if the authenticated user is the admin who created the lesson
    if (lesson.adminId !== req.user.adminId) {
      return res.status(403).json({ message: "Not authorized to update this lesson" });
    }

    // Update the free course with new data
    const updatedLesson = await courseLessons.findOneAndUpdate(
      { lessonId },
      req.body,
      { new: true, runValidators: true }
    );

    // Respond with the updated free course data
    res.status(200).json({message:"Course Updated Successfully", Updated_Lesson_Details: updatedLesson});
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: error.message });
  }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Find the free course by ID
    const deleteLesson = await courseLessons.findOne({ lessonId });

    if (!deleteLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Check if the authenticated user is the admin who created the lesson
    if (deleteLesson.adminId !== req.user.adminId) {
      return res.status(403).json({ message: "Not authorized to delete this lesson" });
    }

    // Delete the lesson from the database
    await courseLessons.findOneAndDelete({ lessonId });

    // Respond with a success message
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting the lesson: ", error);
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ message: "Internal server error" });
  }
};
