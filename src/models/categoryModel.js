import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CourseCategory = new mongoose.Schema({
  categoryId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  courseTitle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  courseOrder: {
    type: Number,
    required: true,
  },
  coursePrice: {
    type: String,
    required: true,
    trim: true,
  },
  videoLink: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignmentQuestion1: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  assignmentQuestion2: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  assignmentQuestion3: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  tablature: {
    type: Buffer,
    required: false,
  },
  videoThumbnail: {
    type: Buffer,
    required: false,
  },
  audio: {
    type: Buffer,
    required: false,
  },
  loop: {
    type: Buffer,
    required: false,
  },
  category: {
    type: String,
    required: true,
    // default: 'Beginner',
  },
  adminId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Spicy_Course_Category", CourseCategory);
