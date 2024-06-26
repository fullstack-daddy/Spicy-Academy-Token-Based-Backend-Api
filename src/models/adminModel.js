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
    }
  },
  { timestamps: true }
);

// Pre-save hook to handle role and password
// userSchema.pre('save', function (next) {
//   const user = this;

//   // If password is not modified, skip hashing
//   if (!user.isModified('password')) {
//     return next();
//   }

//   // Generate salt and hash the password
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });
export default mongoose.model("Spicy_Admins", userSchema);
