import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Données de test pour les utilisateurs
const users = [
  {
    email: "student1@ucad.edu.sn",
    password: "Student123!",
    role: "user",
  },
  {
    email: "student2@ucad.edu.sn",
    password: "Student123!",
    role: "user",
  },
  {
    email: "admin@ucad.edu.sn",
    password: "Admin123!",
    role: "admin",
  },
];

async function populateTestUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Supprimer les utilisateurs existants avec ces emails
    for (const userData of users) {
      await User.deleteOne({ email: userData.email });
    }

    // Créer les utilisateurs
    for (const userData of users) {
      // Hasher le mot de passe manuellement
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        email: userData.email,
        password: hashedPassword, // Utiliser le mot de passe déjà hashé
        role: userData.role,
        isActive: true,
        lastLogin: new Date(),
      });

      await user.save();
      logger.info(`Created test user: ${user.email}`);

      // Vérifier que l'authentification fonctionne
      try {
        const isMatch = await bcrypt.compare(userData.password, user.password);
        logger.info(
          `Test password verification for ${user.email}: ${
            isMatch ? "Success" : "Failed"
          }`
        );
      } catch (error) {
        logger.error(`Error testing password for ${user.email}:`, error);
      }
    }

    logger.info("Test users created successfully");
  } catch (error) {
    logger.error("Error creating test users:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populateTestUsers().catch(error => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
