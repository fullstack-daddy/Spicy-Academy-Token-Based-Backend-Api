import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'

const pendingAssignment = new mongoose.Schema({
    assignmentId: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    assignment1StudentRemarkImage: {
        type: Buffer,
        required: false,
    },
    assignment2StudentRemarkImage: {
        type: Buffer,
        required: false,
    },
    assignment3StudentRemarkImage: {
        type: Buffer,
        required: false,
    },
    assignment1StudentRemarkAudio: {
        type: Buffer,
        required: false,
    },
    assignment2StudentRemarkAudio: {
        type: Buffer,
        required: false,
    },
    assignment3StudentRemarkAudio: {
        type: Buffer,
        required: false,
    },
    assignmentStudentSubmissionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    // courseId: {
    //     type: String,
    //     required: true,
    // },
    studentId: {
        type: String,
        required: true,
    },
    studentEmail:{
        type: String,
        required: true,
    },
    adminId:{
        type: String,
        required: true,
    },
    studentName:{
        type: String,
        required: true,
    },
    assignment1StudentRemark:{
        type: String,
        required: true,
        trim: true,
    },
    assignment2StudentRemark:{
        type: String,
        required: true,
        trim: true,
    },
    assignment3StudentRemark:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "reviewed"],
      }
})

export default mongoose.model("pendingAssignment", pendingAssignment);