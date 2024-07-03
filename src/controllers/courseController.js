import freeCourseModel from "../models/freeCourseModel.js";
import shopperCourseModel from "../models/shopperCourseModel.js";
import checkPrivilege from "../middleware/checkPrivilege.js";

// Helper function to get the correct ID based on user role
const getUserId = (user) => {
  return user.superAdminId || user.adminId;
};

// Helper function to check if the user is authorized
const isAuthorized = (user, course) => {
  return user.superAdminId || user.adminId === course.adminId;
};

// Add a new free course
export const addFreeCourse = [
  checkPrivilege("Create Free Course"),
  async (req, res) => {
    try {
      const newFreeCourse = new freeCourseModel({
        ...req.body,
        adminId: getUserId(req.user),
      });
      const savedFreeCourse = await newFreeCourse.save();
      res
        .status(201)
        .json({ message: "Course Created Successfully", savedFreeCourse });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
];

// Add a new shopper course
export const addShopperCourse = [
  checkPrivilege("Create Shopper Course"),
  async (req, res) => {
    try {
      const newShopperCourse = new shopperCourseModel({
        ...req.body,
        adminId: getUserId(req.user),
      });
      const savedShopperCourse = await newShopperCourse.save();
      res
        .status(201)
        .json({ message: "Course Created Successfully", savedShopperCourse });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
];

// Retrieve all free courses for the authenticated Admin or Superadmin
export const getAdminFreeCourses = async (req, res) => {
  try {
    const query = req.user.superAdminId ? {} : { adminId: req.user.adminId };
    const freeCourses = await freeCourseModel.find(query);
    res.status(200).send(freeCourses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve all shopper courses for the authenticated Admin or Superadmin
export const getAdminShopperCourses = async (req, res) => {
  try {
    const query = req.user.superAdminId ? {} : { adminId: req.user.adminId };
    const shopperCourses = await shopperCourseModel.find(query);
    res.status(200).send(shopperCourses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a free course
export const updateAdminFreeCourse = [
  checkPrivilege("Edit Free Course"),
  async (req, res) => {
    try {
      const { freeCourseId } = req.params;
      const freeCourse = await freeCourseModel.findOne({ freeCourseId });

      if (!freeCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!isAuthorized(req.user, freeCourse)) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this course" });
      }

      const updatedFreeCourse = await freeCourseModel.findOneAndUpdate(
        { freeCourseId },
        req.body,
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Course Updated Successfully", updatedFreeCourse });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Update a shopper course
export const updateAdminShopperCourse = [
  checkPrivilege("Edit Shopper Course"),
  async (req, res) => {
    try {
      const { shopperCourseId } = req.params;
      const shopperCourse = await shopperCourseModel.findOne({
        shopperCourseId,
      });

      if (!shopperCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!isAuthorized(req.user, shopperCourse)) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this course" });
      }

      const updatedShopperCourse = await shopperCourseModel.findOneAndUpdate(
        { shopperCourseId },
        req.body,
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Course Updated Successfully", updatedShopperCourse });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Delete a free course
export const deleteFreeCourse = [
  checkPrivilege("Delete Free Course"),
  async (req, res) => {
    try {
      const { freeCourseId } = req.params;
      const deleteFreeCourse = await freeCourseModel.findOne({ freeCourseId });

      if (!deleteFreeCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!isAuthorized(req.user, deleteFreeCourse)) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this course" });
      }

      await freeCourseModel.findOneAndDelete({ freeCourseId });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting free course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Delete a shopper course
export const deleteShopperCourse = [
  checkPrivilege("Delete Shopper Course"),
  async (req, res) => {
    try {
      const { shopperCourseId } = req.params;
      const shopperCourse = await shopperCourseModel.findOne({
        shopperCourseId,
      });

      if (!shopperCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!isAuthorized(req.user, shopperCourse)) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this course" });
      }

      await shopperCourseModel.findOneAndDelete({ shopperCourseId });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting shopper course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
