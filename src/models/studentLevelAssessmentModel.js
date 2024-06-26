import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const assessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    assessmentQuestion1: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
    assessmentQuestion2: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
    assessmentQuestion3: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
    assessmentQuestion4: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
    assessmentQuestion5: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
    assessmentQuestion6: {
      type: String,
      required: [true, "Please Answer All Questions"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Spicy_Level_Assessment", assessmentSchema);
