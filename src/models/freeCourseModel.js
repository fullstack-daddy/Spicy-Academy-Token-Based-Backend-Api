import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const AddFreeVideoCourseSchema = new mongoose.Schema({
  freeCourseId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  courseTitle: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  courseOrder: {
    type: Number,
    required: false,
  },
  videoLink: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  assignmentQuestion1: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  assignmentQuestion2: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  assignmentQuestion3: {
    type: String,
    required: false,
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

export default mongoose.model("Spicy_Free_Course", AddFreeVideoCourseSchema);