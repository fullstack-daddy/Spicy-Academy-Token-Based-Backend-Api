// courseController.js
import Category from "../models/Category.js";

// Add category function
export const addCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      adminId: req.user.userId,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update category function
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category
    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the authenticated user is the admin who created the category
    if (category.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this category" });
    }

    // Update the category
    const updatedCategory = await Category.findOneAndUpdate(
      { categoryId },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCategory);
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
    const deleteCategory = await Category.findOne({ categoryId });

    if (!deleteCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the authenticated user is the admin who created the category
    if (deleteCategory.adminId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this category" });
    }

    // Delete the category
    await Category.findOneAndDelete({ categoryId });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};