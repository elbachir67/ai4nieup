import express from "express";
import { Pathway } from "../models/Pathway.js";
import { Goal } from "../models/LearningGoal.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Obtenir le tableau de bord de l'apprenant
router.get("/dashboard", auth, async (req, res) => {
  try {
    // Récupérer les parcours actifs
    const activePathways = await Pathway.find({
      userId: req.user._id,
      status: "active",
    }).populate("goalId");

    // Récupérer les parcours complétés
    const completedPathways = await Pathway.find({
      userId: req.user._id,
      status: "completed",
    }).populate("goalId");

    // Calculer les statistiques d'apprentissage
    const learningStats = {
      totalHoursSpent: 0,
      completedResources: 0,
      averageQuizScore: 0,
      streakDays: 0,
    };

    // Calculer les prochaines étapes
    const nextMilestones = activePathways.map(pathway => ({
      pathwayId: pathway._id,
      goalTitle: pathway.goalId.title,
      moduleName: `Module ${pathway.currentModule + 1}`,
      dueDate: pathway.estimatedCompletionDate,
    }));

    // Agréger les statistiques
    activePathways.forEach(pathway => {
      pathway.moduleProgress.forEach(module => {
        learningStats.completedResources += module.resources.filter(
          r => r.completed
        ).length;
        if (module.quiz.completed) {
          learningStats.averageQuizScore += module.quiz.score;
        }
      });
    });

    // Calculer la moyenne des scores
    if (learningStats.averageQuizScore > 0) {
      learningStats.averageQuizScore = Math.round(
        learningStats.averageQuizScore /
          activePathways.reduce(
            (acc, p) =>
              acc + p.moduleProgress.filter(m => m.quiz.completed).length,
            0
          )
      );
    }

    res.json({
      activePathways,
      completedPathways,
      nextMilestones,
      learningStats,
    });
  } catch (error) {
    logger.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

// Créer un nouveau parcours
router.post("/start", auth, async (req, res) => {
  try {
    const { goalId } = req.body;

    // Vérifier si un parcours existe déjà
    const existingPathway = await Pathway.findOne({
      userId: req.user._id,
      goalId,
      status: { $in: ["active", "paused"] },
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
    const pathway = new Pathway({
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

// Obtenir un parcours spécifique
router.get("/:pathwayId", auth, async (req, res) => {
  try {
    const pathway = await Pathway.findOne({
      _id: req.params.pathwayId,
      userId: req.user._id,
    }).populate("goalId");

    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    res.json(pathway);
  } catch (error) {
    logger.error("Error fetching pathway:", error);
    res.status(500).json({ error: "Error fetching pathway" });
  }
});

// Mettre à jour la progression d'un module
router.put("/:pathwayId/modules/:moduleIndex", auth, async (req, res) => {
  try {
    const { pathwayId, moduleIndex } = req.params;
    const { resourceId, completed, quizScore } = req.body;

    const pathway = await Pathway.findOne({
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
    const pathway = await Pathway.findOne({
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
