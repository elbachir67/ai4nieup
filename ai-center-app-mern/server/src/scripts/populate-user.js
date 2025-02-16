import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

require("dotenv").config();

// Sample users data with more secure passwords
const users = [
  {
    email: "admin@ucad.edu.sn",
    password: "admin123", // Will be hashed
    role: "admin",
  },
  {
    email: "student1@ucad.edu.sn",
    password: "Student123!", // More secure password
    role: "user",
  },
  {
    email: "student2@ucad.edu.sn",
    password: "Student456!", // More secure password
    role: "user",
  },
];

async function populateDatabase() {
  try {
    logger.info("Attempting to connect to MongoDB at:", config.mongodb.uri);
    await mongoose.connect(config.mongodb.uri);
    logger.info("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    logger.info("Cleared existing users");

    // Create users with hashed passwords
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
        lastLogin: new Date(),
      });
      await user.save();
      logger.info(`Created user: ${user.email} (${user.role})`);
    }

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Execute the population script
populateDatabase().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
