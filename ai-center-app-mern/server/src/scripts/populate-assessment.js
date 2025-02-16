import mongoose from "mongoose";
import { Assessment } from "../models/Assessment.js";
import { LearningGoal } from "../models/LearningGoal.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

const assessments = [
  {
    title: "Évaluation Mathématiques Fondamentales",
    category: "math",
    difficulty: "basic",
    questions: [
      {
        text: "Quelle est la différence entre une matrice et un vecteur ?",
        options: [
          {
            text: "Un vecteur est unidimensionnel, une matrice est bidimensionnelle",
            isCorrect: true,
          },
          {
            text: "Il n'y a aucune différence",
            isCorrect: false,
          },
          {
            text: "Une matrice ne peut contenir que des nombres",
            isCorrect: false,
          },
        ],
        explanation:
          "Un vecteur est une structure unidimensionnelle (1D) tandis qu'une matrice est bidimensionnelle (2D), organisée en lignes et colonnes.",
      },
      // Ajoutez d'autres questions...
    ],
  },
  {
    title: "Évaluation Machine Learning",
    category: "ml",
    difficulty: "basic",
    questions: [
      {
        text: "Quelle est la différence entre l'apprentissage supervisé et non supervisé ?",
        options: [
          {
            text: "L'apprentissage supervisé utilise des données étiquetées, l'apprentissage non supervisé non",
            isCorrect: true,
          },
          {
            text: "L'apprentissage supervisé est plus rapide",
            isCorrect: false,
          },
          {
            text: "L'apprentissage non supervisé nécessite plus de données",
            isCorrect: false,
          },
        ],
        explanation:
          "L'apprentissage supervisé utilise des données étiquetées pour entraîner le modèle, tandis que l'apprentissage non supervisé trouve des patterns dans des données non étiquetées.",
      },
      // Ajoutez d'autres questions...
    ],
  },
  // Ajoutez d'autres évaluations...
];

async function populateAssessments() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing assessments
    await Assessment.deleteMany({});
    logger.info("Cleared existing assessments");

    // Get goals to link with assessments
    const goals = await LearningGoal.find({});

    // Add recommended goals to assessments
    const assessmentsWithGoals = assessments.map(assessment => ({
      ...assessment,
      recommendedGoals: goals
        .filter(
          goal =>
            goal.category === assessment.category &&
            goal.difficulty === assessment.difficulty
        )
        .map(goal => goal._id),
    }));

    // Insert assessments
    await Assessment.insertMany(assessmentsWithGoals);
    logger.info("Inserted new assessments");

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

populateAssessments().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
