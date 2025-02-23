import mongoose from "mongoose";
import { Pathway } from "../models/Pathway.js";
import { Goal } from "../models/LearningGoal.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

async function populatePathways() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Récupérer quelques utilisateurs et goals pour les exemples
    const users = await User.find().limit(3);
    const goals = await Goal.find().limit(3);

    if (users.length === 0 || goals.length === 0) {
      throw new Error("No users or goals found");
    }

    // Créer des parcours d'exemple
    const pathways = [];

    for (let i = 0; i < users.length; i++) {
      const goal = goals[i % goals.length];
      const startDate = new Date();
      const estimatedEndDate = new Date();
      estimatedEndDate.setDate(
        startDate.getDate() + goal.estimatedDuration * 7
      ); // Conversion en jours

      // Créer un parcours avec progression aléatoire
      const pathway = new Pathway({
        userId: users[i]._id,
        goalId: goal._id,
        status: "active",
        progress: Math.floor(Math.random() * 100),
        currentModule: 0,
        moduleProgress: goal.modules.map((module, index) => ({
          moduleIndex: index,
          completed: Math.random() > 0.5,
          resources: module.resources.map(resource => ({
            resourceId: resource._id || `resource-${Math.random()}`,
            completed: Math.random() > 0.5,
            completedAt: new Date(Date.now() - Math.random() * 1000000000),
          })),
          quiz: {
            completed: Math.random() > 0.5,
            score: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
            completedAt: new Date(Date.now() - Math.random() * 1000000000),
          },
        })),
        startedAt: startDate,
        lastAccessedAt: new Date(),
        estimatedCompletionDate: estimatedEndDate,
        adaptiveRecommendations: [
          {
            type: "resource",
            description: "Ressource recommandée basée sur vos progrès",
            priority: "high",
            status: "pending",
          },
          {
            type: "practice",
            description: "Exercice pratique recommandé",
            priority: "medium",
            status: "pending",
          },
        ],
      });

      pathways.push(pathway);
    }

    // Sauvegarder les parcours
    await Pathway.insertMany(pathways);
    logger.info(`Created ${pathways.length} pathways`);

    logger.info("Successfully populated pathways");
  } catch (error) {
    logger.error("Error populating pathways:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populatePathways().catch(error => {
  logger.error("Fatal error during pathway population:", error);
  process.exit(1);
});
