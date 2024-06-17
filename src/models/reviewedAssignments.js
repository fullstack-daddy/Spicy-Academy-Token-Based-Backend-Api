import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

const reviewedAssignment = new mongoose.Schema(
  {
    assignmentId: {
      type: String,
      //   default: uuidv4,
      unique: true,
    },
    assignmentStudentSubmissionDate: {
      type: Date,
      required: true,
    },
    assignmentTutorReviewDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lessonTitle: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    assignment1TutorGrade: {
      type: Number,
      required: true,
    },
    assignment2TutorGrade: {
      type: Number,
      required: true,
    },
    assignment3TutorGrade: {
      type: Number,
      required: true,
    },
    assignment1TutorRemark: {
      type: String,
      required: true,
    },
    assignment2TutorRemark: {
      type: String,
      required: true,
    },
    assignment3TutorRemark: {
      type: String,
      required: true,
    },
    assignment1TutorRemarkVideo: {
      type: String,
      required: false,
    },
    assignment2TutorRemarkVideo: {
      type: String,
      required: false,
    },
    assignment3TutorRemarkVideo: {
      type: String,
      required: false,
    },
    assignment1TutorRemarkAudio: {
      type: Buffer,
      required: false,
    },
    assignment2TutorRemarkAudio: {
      type: Buffer,
      required: false,
    },
    assignment3TutorRemarkAudio: {
      type: Buffer,
      required: false,
    },
    // teachersResponse:{
    //   type: mongoose.Schema.Types.Mixed,
    //   required: true,
    // },
    status: {
      type: String,
      required: true,
      enum: ["reviewed"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("reviewedAssignment", reviewedAssignment);
