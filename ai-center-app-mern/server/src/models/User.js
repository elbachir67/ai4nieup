import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    logger.info(`Hashing password for user: ${this.email}`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    logger.info(`Generated hash for ${this.email}:`, hash);

    this.password = hash;
    next();
  } catch (error) {
    logger.error("Error hashing password:", error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    logger.info(`Comparing password for user: ${this.email}`);
    logger.info(`Stored hash for ${this.email}:`, this.password);
    logger.info(`Candidate password length: ${candidatePassword.length}`);

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    logger.info(`Password comparison result for ${this.email}:`, isMatch);

    return isMatch;
  } catch (error) {
    logger.error(`Error comparing password for ${this.email}:`, error);
    throw error;
  }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  try {
    const payload = {
      id: this._id,
      email: this.email,
      role: this.role,
    };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    logger.error("Error generating auth token:", error);
    throw error;
  }
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  try {
    logger.info(`Attempting to find user by credentials: ${email}`);

    const user = await this.findOne({ email, isActive: true });
    if (!user) {
      logger.info(`No user found with email: ${email}`);
      throw new Error("Invalid credentials");
    }

    logger.info(`Found user: ${email}, checking password...`);
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.info(`Password does not match for user: ${email}`);
      throw new Error("Invalid credentials");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User authenticated successfully: ${email}`);
    return user;
  } catch (error) {
    logger.error(`Authentication error for ${email}:`, error);
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
