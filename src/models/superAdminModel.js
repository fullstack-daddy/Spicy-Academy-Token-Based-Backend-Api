import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    superAdminId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    firstName: {
      type: String,
      required: "Your firstname is required",
      max: 25,
    },
    lastName: {
      type: String,
      required: "Your lastname is required",
      max: 25,
    },
    username: {
      type: String,
      required: "Enter a unique username",
      unique: true,
      max: 25,
    },
    email: {
      type: String,
      required: "Your email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      select: false,
    },
    role: {
      type: String,
      default: "superadmin",
    },
    googleId: {
      type: String,
      unique: false,
      required: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to handle password hashing
userSchema.pre("save", function (next) {
  const user = this;

  // If password is not modified, skip hashing
  if (!user.isModified("password")) {
    return next();
  }

  // Generate salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export default mongoose.model("Spicy_Superadmin", userSchema);