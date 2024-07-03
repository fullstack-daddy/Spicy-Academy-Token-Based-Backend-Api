import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    firstName: {
      type: String,
      required: "Firstname is required",
      max: 25,
      trim: true,
    },
    lastName: {
      type: String,
      required: "Lastname is required",
      max: 25,
      trim: true,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    telephone: {
      type: String,
      required: false, //"Telephone number is required",
      max: 25,
      trim: true,
      unique: true,
    },
    
    username: {
      type: String,
      required: false,
      unique: true,
      max: 25,
      trim: true,
    },
    email: {
      type: String,
      required: "Valid email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    // temporaryPassword: {
    //   type: String,
    //   required: false,
    //   select: true,
    //   default: uuidv4, 
    // },
    password: {
      type: String,
      required: "Password is required",
      select: false, 
    },
    role: {
      type: String,
      required: false,
      default: "admin",
    },
    status: {
      type: String,
      required: true,
      enum: ["onboarded"],
      default: "onboarded",
    },
    priviledges: {
      type: array,
      enum: ["Create Free Course","Edit Free Course", "Delete Free Course", "Create Shopper Course", "Edit Shopper Course", "Delete Shopper Course", "Create Subscription Plan","Edit Subscription Plan", "Delete Subscription Plan", "Create Category","Edit Category", "Delete Category", "Create Course","Edit Course", "Delete Course","Create Lesson","Edit Lesson", "Delete Lesson",],
      default: ["Create Free Course"],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Spicy_Admins", userSchema);
