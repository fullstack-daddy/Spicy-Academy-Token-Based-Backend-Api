import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Your firstname is required"],
      maxlength: 25,
    },
    lastName: {
      type: String,
      required: [true, "Your lastname is required"],
      maxlength: 25,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    username: {
      type: String,
      required: [true, "Enter a unique username"],
      unique: true,
      maxlength: 25,
    },
    email: {
      type: String,
      required: [true, "Your email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
      select: false,
      minlength: 8,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
    telephone: {
      type: String,
      maxlength: 25,
      trim: true,
      unique: true,
      match: [/^\d{10,15}$/, "Telephone number is invalid"],
    },
    googleId: {
      type: String,
      unique: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to handle role and password
userSchema.pre("save", function (next) {
  const user = this;

  // Convert role to lowercase
  if (user.role) {
    user.role = user.role.toLowerCase();
  }

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

export default mongoose.model("Spicy_Students", userSchema);
