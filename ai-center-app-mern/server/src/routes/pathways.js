import express from "express";
import { body } from "express-validator";
import { Pathway } from "../models/Pathway.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { Goal } from "../models/LearningGoal.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Get learner's active pathway
router.get("/active", auth, async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Learner profile not found" });
    }

    const pathway = await Pathway.findOne({
      learnerId: profile._id,
      status: "active",
    })
      .populate("goalId")
      .populate("conceptSequence.concept");

    if (!pathway) {
      return res.status(404).json({ error: "No active pathway found" });
    }

    res.json(pathway);
  } catch (error) {
    logger.error("Error fetching active pathway:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create new pathway
router.post(
  "/",
  auth,
  [body("goalId").isMongoId(), body("estimatedDuration").isInt({ min: 1 })],
  validate,
  async (req, res) => {
    try {
      const { goalId, estimatedDuration } = req.body;

      // Get learner profile
      const profile = await LearnerProfile.findOne({ userId: req.user._id });
      if (!profile) {
        return res.status(404).json({ error: "Learner profile not found" });
      }

      // Get learning goal
      const goal = await LearningGoal.findById(goalId).populate(
        "requiredConcepts"
      );
      if (!goal) {
        return res.status(404).json({ error: "Learning goal not found" });
      }

      // Create concept sequence based on prerequisites
      const conceptSequence = goal.requiredConcepts.map((concept, index) => ({
        concept: concept._id,
        order: index + 1,
        status: "pending",
      }));

      // Create new pathway
      const pathway = new Pathway({
        learnerId: profile._id,
        goalId,
        estimatedDuration,
        conceptSequence,
        status: "active",
      });

      await pathway.save();

      // Update learner profile
      profile.goal = goalId;
      await profile.save();

      logger.info(`New pathway created for learner ${profile._id}`);
      res.status(201).json(pathway);
    } catch (error) {
      logger.error("Error creating pathway:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update concept status in pathway
router.put(
  "/concept/:conceptId",
  auth,
  [
    body("status").isIn(["pending", "in_progress", "completed"]),
    body("pathwayId").isMongoId(),
  ],
  validate,
  async (req, res) => {
    try {
      const { status, pathwayId } = req.body;
      const conceptId = req.params.conceptId;

      const profile = await LearnerProfile.findOne({ userId: req.user._id });
      if (!profile) {
        return res.status(404).json({ error: "Learner profile not found" });
      }

      const pathway = await Pathway.findOne({
        _id: pathwayId,
        learnerId: profile._id,
      });

      if (!pathway) {
        return res.status(404).json({ error: "Pathway not found" });
      }

      // Update concept status
      const conceptIndex = pathway.conceptSequence.findIndex(
        c => c.concept.toString() === conceptId
      );

      if (conceptIndex === -1) {
        return res.status(404).json({ error: "Concept not found in pathway" });
      }

      pathway.conceptSequence[conceptIndex].status = status;

      if (status === "completed") {
        pathway.conceptSequence[conceptIndex].completedAt = new Date();
        pathway.analytics.completedConcepts += 1;
      } else if (
        status === "in_progress" &&
        !pathway.conceptSequence[conceptIndex].startedAt
      ) {
        pathway.conceptSequence[conceptIndex].startedAt = new Date();
      }

      // Update pathway progress
      const totalConcepts = pathway.conceptSequence.length;
      const completedConcepts = pathway.conceptSequence.filter(
        c => c.status === "completed"
      ).length;
      pathway.progress = (completedConcepts / totalConcepts) * 100;

      // Check if pathway is completed
      if (pathway.progress === 100) {
        pathway.status = "completed";
      }

      await pathway.save();

      logger.info(
        `Updated concept ${conceptId} status to ${status} in pathway ${pathwayId}`
      );
      res.json(pathway);
    } catch (error) {
      logger.error("Error updating concept status:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Get pathway analytics
router.get("/analytics/:pathwayId", auth, async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Learner profile not found" });
    }

    const pathway = await Pathway.findOne({
      _id: req.params.pathwayId,
      learnerId: profile._id,
    })
      .populate("goalId")
      .populate("conceptSequence.concept");

    if (!pathway) {
      return res.status(404).json({ error: "Pathway not found" });
    }

    const analytics = {
      ...pathway.analytics.toObject(),
      estimatedCompletion: calculateEstimatedCompletion(pathway),
      conceptBreakdown: analyzeConceptProgress(pathway.conceptSequence),
      learningRate: calculateLearningRate(pathway),
    };

    res.json(analytics);
  } catch (error) {
    logger.error("Error fetching pathway analytics:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions for analytics
function calculateEstimatedCompletion(pathway) {
  const { startDate, completedConcepts } = pathway.analytics;
  const totalConcepts = pathway.conceptSequence.length;

  if (completedConcepts === 0) return null;

  const timeElapsed = Date.now() - startDate.getTime();
  const conceptsRemaining = totalConcepts - completedConcepts;
  const timePerConcept = timeElapsed / completedConcepts;

  return new Date(Date.now() + conceptsRemaining * timePerConcept);
}

function analyzeConceptProgress(conceptSequence) {
  return {
    pending: conceptSequence.filter(c => c.status === "pending").length,
    inProgress: conceptSequence.filter(c => c.status === "in_progress").length,
    completed: conceptSequence.filter(c => c.status === "completed").length,
  };
}

function calculateLearningRate(pathway) {
  const { completedConcepts } = pathway.analytics;
  const timeElapsed = Date.now() - pathway.analytics.startDate.getTime();
  const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);

  return completedConcepts / daysElapsed;
}

export const pathwayRoutes = router;
