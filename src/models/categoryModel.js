import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CourseCategory = new mongoose.Schema({
  categoryId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  categoryTitle: {
    type: String,
    default: "Beginner",
    enum: ["Beginner", "Amateur", "Intermediate", "Advanced"],
    trim: true,
  },
  categoryOrder: {
    type: Number,
    required: true,
  },
  enrolledStudents: {
    type: Array,
    default: [],
  },
  courses: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("Spicy_Course_Category", CourseCategory);
