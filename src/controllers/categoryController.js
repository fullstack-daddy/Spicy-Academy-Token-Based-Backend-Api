// courseController.js
import categoryModel from "../models/categoryModel.js";

// Add category function
export const addCategory = async (req, res) => {
  try {
    const newCategory = new categoryModel({
      ...req.body,
      adminId: req.user.adminId,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json({message: "Category Created Successfully", savedCategory});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Get all Category created by a Admin
export const getAllAdminCategory = async (req, res) => {
  try {
    // Find all free courses created by the authenticated user
    const getAllCategory = await categoryModel.find({ adminId: req.user.adminId });
    
    // Respond with the retrieved free courses
    res.status(200).send(getAllCategory);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).send(error.message);
  }
}

// Update category function
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category
    const category = await categoryModel.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the authenticated user is the admin who created the category
    if (category.adminId !== req.user.adminId) {
      return res.status(403).json({ message: "Not authorized to update this category" });
    }

    // Update the category
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { categoryId },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({message: "Category Updated Successfully", updatedCategory});
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete category function
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Find the category
    const deleteCategory = await categoryModel.findOne({ categoryId });

    if (!deleteCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the authenticated user is the admin who created the category
    if (deleteCategory.adminId !== req.user.adminId) {
      return res.status(403).json({ message: "Not authorized to delete this category" });
    }

    // Delete the category
    await categoryModel.findOneAndDelete({ categoryId });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};