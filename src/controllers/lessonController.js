import courseLessons from "../models/courseLessonsModel.js";

// Helper function to get the correct ID based on user role
const getUserId = (user) => {
  return user.superAdminId || user.adminId;
};

// Helper function to check if the user is authorized
const isAuthorized = (user, lesson) => {
  return user.superAdminId || user.adminId === lesson.adminId;
};

// Add a new lesson
export const addCourseLesson = async (req, res) => {
  try {
    const newLesson = new courseLessons({
      ...req.body,
      adminId: getUserId(req.user),
    });
    const savedLesson = await newLesson.save();
    res.status(201).json({message:"Lesson Created Successfully", Lesson_Details: savedLesson});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve all lessons for the authenticated Admin or Superadmin
export const getAllAdminLessons = async (req, res) => {
  try {
    const query = req.user.superAdminId ? {} : { adminId: req.user.adminId };
    const allLessons = await courseLessons.find(query);
    res.status(200).send(allLessons);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve all free lessons for the authenticated Admin or Superadmin
export const getAdminFreeLessons = async (req, res) => {
  try {
    const query = req.user.superAdminId 
      ? { lessonSubscriptionCategory: "free" } 
      : { adminId: req.user.adminId, lessonSubscriptionCategory: "free" };
    const freeLessons = await courseLessons.find(query);
    res.status(200).send(freeLessons);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve all shopper Lessons for the authenticated Admin or Superadmin
export const getAdminShopperLessons = async (req, res) => {
  try {
    const query = req.user.superAdminId 
      ? { lessonSubscriptionCategory: "paid" } 
      : { adminId: req.user.adminId, lessonSubscriptionCategory: "paid" };
    const shopperLessons = await courseLessons.find(query);
    res.status(200).send(shopperLessons);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a lesson
export const updateAdminLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await courseLessons.findOne({ lessonId });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!isAuthorized(req.user, lesson)) {
      return res.status(403).json({ message: "Not authorized to update this lesson" });
    }

    const updatedLesson = await courseLessons.findOneAndUpdate(
      { lessonId },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({message:"Lesson Updated Successfully", Updated_Lesson_Details: updatedLesson});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const deleteLesson = await courseLessons.findOne({ lessonId });

    if (!deleteLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!isAuthorized(req.user, deleteLesson)) {
      return res.status(403).json({ message: "Not authorized to delete this lesson" });
    }

    await courseLessons.findOneAndDelete({ lessonId });
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting the lesson: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};