import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const courseLessonSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  lessonTitle: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  lessonLevel:{
    type: String,
    required: true,
    default: "Beginner",
    enum: ["Beginner", "Amateur", "Intermediate", "Advanced", ]
  },
  lessonOrder: {
    type: Number,
    required: false,
  },
  videoLink: {
    type: String,
    required: true,
    unique: false,
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
  lessonSubscriptionCategory:{
    type: String,
    required: true,
    default: "free",
    enum: ["free", "paid"]
  },
  adminId: {
    type: String,
    required: true,
  },
  enrolledStudents: {
 type: Array,
 default: [],
 required: false,
 },
});

export default mongoose.model("Spicy_Course_Lessons", courseLessonSchema);