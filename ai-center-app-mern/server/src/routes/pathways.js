import express from "express";
import { Pathway } from "../models/Pathway.js";
import { Goal } from "../models/LearningGoal.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import PathwayGenerationService from "../services/PathwayGenerationService.js";

const router = express.Router();

// Générer un nouveau parcours
router.post("/generate", auth, async (req, res) => {
  try {
    const { goalId } = req.body;

    if (!goalId) {
      return res.status(400).json({ error: "goalId est requis" });
    }

    // Vérifier si un parcours existe déjà
    const existingPathway = await Pathway.findOne({
      userId: req.user.id,
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

    // Générer le parcours personnalisé
    const pathwayData = await PathwayGenerationService.generatePathway(
      req.user.id,
      goalId
    );

    // Créer le parcours
    const pathway = new Pathway({
      userId: req.user.id,
      goalId,
      status: "active",
      progress: 0,
      currentModule: 0,
      moduleProgress: pathwayData.adaptedModules.map((module, index) => ({
        moduleIndex: index,
        completed: false,
        resources: module.resources.map(resource => ({
          resourceId:
            resource._id?.toString() || resource.id?.toString() || resource,
          completed: false,
        })),
        quiz: { completed: false },
      })),
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      estimatedCompletionDate: new Date(
        Date.now() + goal.estimatedDuration * 7 * 24 * 60 * 60 * 1000
      ),
      adaptiveRecommendations: pathwayData.recommendations,
    });

    await pathway.save();

    // Récupérer le parcours avec les relations
    const populatedPathway = await Pathway.findById(pathway._id).populate(
      "goalId"
    );

    res.status(201).json(populatedPathway);
  } catch (error) {
    logger.error("Error generating pathway:", error);
    res.status(500).json({ error: "Error generating pathway" });
  }
});

// Obtenir un parcours spécifique
router.get("/:pathwayId", auth, async (req, res) => {
  try {
    const pathway = await Pathway.findOne({
      _id: req.params.pathwayId,
      userId: req.user.id,
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
    const { resourceId, completed } = req.body;

    const pathway = await Pathway.findOne({
      _id: pathwayId,
      userId: req.user.id,
    });

    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    // Mettre à jour la ressource
    if (resourceId) {
      const module = pathway.moduleProgress[moduleIndex];
      if (!module) {
        return res.status(404).json({ error: "Module non trouvé" });
      }

      const resourceIndex = module.resources.findIndex(
        r => r.resourceId === resourceId
      );
      if (resourceIndex > -1) {
        module.resources[resourceIndex].completed = completed;
        module.resources[resourceIndex].completedAt = new Date();
      }

      // Vérifier si le module est complété
      module.completed =
        module.resources.every(r => r.completed) && module.quiz.completed;
    }

    // Mettre à jour la progression globale
    pathway.progress = Math.round(
      (pathway.moduleProgress.filter(m => m.completed).length /
        pathway.moduleProgress.length) *
        100
    );

    await pathway.save();
    res.json(pathway);
  } catch (error) {
    logger.error("Error updating module progress:", error);
    res.status(500).json({ error: "Error updating progress" });
  }
});

export const pathwayRoutes = router;
