import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'

const Assignment = new mongoose.Schema({
    assignmentId: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    assignmentExplanationText: {
        type: String,
        required: true,
    },
    assignmentExplanationImage: {
        type: Buffer,
        required: true,
    },
    assignmentExplanationAudio: {
        type: Buffer,
        required: true,
    },
    assignmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    courseId: {
        type: String,
        required: true,
    },
    assignmentTutorGrade: {
        type: String,
        required: true,
    },
    assignmentTutorRemarkText: {
        type: String,
        required: true,
    },
    assignmentTutorRemarkVideo: {
        type: String,
        required: false,
    },
    assignmentTutorRemarkAudio: {
        type: Buffer,
        required: false,
    }
})

export default mongoose.model("Assignment", Assignment);