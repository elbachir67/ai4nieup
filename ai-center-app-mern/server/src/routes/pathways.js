import express from "express";
import { UserPathway } from "../models/UserPathway.js";
import { Goal } from "../models/LearningGoal.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Obtenir les parcours de l'utilisateur
router.get("/my", auth, async (req, res) => {
  try {
    const pathways = await UserPathway.find({ userId: req.user._id })
      .populate("goalId")
      .sort("-startedAt");

    res.json(pathways);
  } catch (error) {
    logger.error("Error fetching user pathways:", error);
    res.status(500).json({ error: "Error fetching pathways" });
  }
});

// Démarrer un nouveau parcours
router.post("/start", auth, async (req, res) => {
  try {
    const { goalId } = req.body;

    // Vérifier si un parcours existe déjà
    const existingPathway = await UserPathway.findOne({
      userId: req.user._id,
      goalId,
      status: { $in: ["in_progress", "paused"] },
    });

    if (existingPathway) {
      return res.status(400).json({
        error: "Un parcours pour cet objectif existe déjà",
      });
    }

    // Récupérer l'objectif
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ error: "Objectif non trouvé" });
    }

    // Créer le parcours
    const pathway = new UserPathway({
      userId: req.user._id,
      goalId,
      moduleProgress: goal.modules.map((_, index) => ({
        moduleIndex: index,
        completed: false,
        resources: [],
        quiz: { completed: false },
      })),
    });

    await pathway.save();
    await pathway.generateRecommendations();

    res.status(201).json(pathway);
  } catch (error) {
    logger.error("Error starting pathway:", error);
    res.status(500).json({ error: "Error starting pathway" });
  }
});

// Mettre à jour la progression d'un module
router.put("/:pathwayId/modules/:moduleIndex", auth, async (req, res) => {
  try {
    const { pathwayId, moduleIndex } = req.params;
    const { resourceId, completed, quizScore } = req.body;

    const pathway = await UserPathway.findOne({
      _id: pathwayId,
      userId: req.user._id,
    });

    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    const module = pathway.moduleProgress[moduleIndex];
    if (!module) {
      return res.status(404).json({ error: "Module non trouvé" });
    }

    // Mettre à jour la ressource
    if (resourceId) {
      const resourceIndex = module.resources.findIndex(
        r => r.resourceId === resourceId
      );

      if (resourceIndex > -1) {
        module.resources[resourceIndex].completed = completed;
        module.resources[resourceIndex].completedAt = new Date();
      } else {
        module.resources.push({
          resourceId,
          completed,
          completedAt: new Date(),
        });
      }
    }

    // Mettre à jour le quiz
    if (quizScore !== undefined) {
      module.quiz = {
        completed: true,
        score: quizScore,
        completedAt: new Date(),
      };
    }

    // Vérifier si le module est complété
    const allResourcesCompleted = module.resources.every(r => r.completed);
    const quizCompleted = module.quiz.completed;
    module.completed = allResourcesCompleted && quizCompleted;

    await pathway.save();
    await pathway.updateProgress();
    await pathway.generateRecommendations();

    res.json(pathway);
  } catch (error) {
    logger.error("Error updating module progress:", error);
    res.status(500).json({ error: "Error updating progress" });
  }
});

// Obtenir les recommandations
router.get("/:pathwayId/recommendations", auth, async (req, res) => {
  try {
    const pathway = await UserPathway.findOne({
      _id: req.params.pathwayId,
      userId: req.user._id,
    });

    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    await pathway.generateRecommendations();
    res.json(pathway.adaptiveRecommendations);
  } catch (error) {
    logger.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Error getting recommendations" });
  }
});

export const pathwayRoutes = router;
