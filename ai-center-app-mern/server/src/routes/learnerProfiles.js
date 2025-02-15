import express from "express";
import { body } from "express-validator";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Get learner profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({ userId: req.user._id })
      .populate("goal")
      .populate("knownConcepts.conceptId")
      .populate("assessmentResults");

    if (!profile) {
      return res.status(404).json({ error: "Learner profile not found" });
    }

    res.json(profile);
  } catch (error) {
    logger.error("Error fetching learner profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update learner profile
router.put(
  "/",
  auth,
  [
    body("learningPreferences.availableTimePerWeek")
      .optional()
      .isInt({ min: 1 }),
    body("learningPreferences.preferredLearningStyle")
      .optional()
      .isIn(["visual", "theoretical", "practical", "mixed"]),
    body("learningPreferences.previousExperience").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const profile = await LearnerProfile.findOneAndUpdate(
        { userId: req.user._id },
        {
          $set: {
            learningPreferences: req.body.learningPreferences,
          },
        },
        { new: true, upsert: true }
      );

      logger.info(`Profile updated for user ${req.user._id}`);
      res.json(profile);
    } catch (error) {
      logger.error("Error updating learner profile:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update concept proficiency
router.put(
  "/concepts/:conceptId",
  auth,
  [
    body("proficiency").isInt({ min: 0, max: 100 }),
    body("verifiedByTest").isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const { proficiency, verifiedByTest } = req.body;
      const conceptId = req.params.conceptId;

      const profile = await LearnerProfile.findOne({ userId: req.user._id });
      if (!profile) {
        return res.status(404).json({ error: "Learner profile not found" });
      }

      const conceptIndex = profile.knownConcepts.findIndex(
        c => c.conceptId.toString() === conceptId
      );

      if (conceptIndex > -1) {
        profile.knownConcepts[conceptIndex].proficiency = proficiency;
        profile.knownConcepts[conceptIndex].verifiedByTest = verifiedByTest;
      } else {
        profile.knownConcepts.push({
          conceptId,
          proficiency,
          verifiedByTest,
        });
      }

      await profile.save();

      logger.info(
        `Updated concept ${conceptId} proficiency for user ${req.user._id}`
      );
      res.json(profile);
    } catch (error) {
      logger.error("Error updating concept proficiency:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Get learning progress
router.get("/progress", auth, async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({ userId: req.user._id })
      .populate("goal")
      .populate("knownConcepts.conceptId");

    if (!profile) {
      return res.status(404).json({ error: "Learner profile not found" });
    }

    const progress = {
      goalProgress: calculateGoalProgress(profile),
      conceptMastery: analyzeConceptMastery(profile.knownConcepts),
      learningStats: generateLearningStats(profile),
    };

    res.json(progress);
  } catch (error) {
    logger.error("Error fetching learning progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions for progress calculation
function calculateGoalProgress(profile) {
  if (!profile.goal) return null;

  const requiredConcepts = profile.goal.requiredConcepts.length;
  const masteredConcepts = profile.knownConcepts.filter(
    c => c.proficiency >= 70
  ).length;

  return {
    percentage: (masteredConcepts / requiredConcepts) * 100,
    masteredConcepts,
    totalConcepts: requiredConcepts,
  };
}

function analyzeConceptMastery(knownConcepts) {
  return {
    beginner: knownConcepts.filter(c => c.proficiency < 40).length,
    intermediate: knownConcepts.filter(
      c => c.proficiency >= 40 && c.proficiency < 70
    ).length,
    advanced: knownConcepts.filter(c => c.proficiency >= 70).length,
    verifiedConcepts: knownConcepts.filter(c => c.verifiedByTest).length,
  };
}

function generateLearningStats(profile) {
  const verifiedConcepts = profile.knownConcepts.filter(c => c.verifiedByTest);
  const averageProficiency =
    verifiedConcepts.reduce((acc, curr) => acc + curr.proficiency, 0) /
    verifiedConcepts.length;

  return {
    averageProficiency,
    totalConceptsLearned: profile.knownConcepts.length,
    verifiedConceptsCount: verifiedConcepts.length,
  };
}

export const learnerProfileRoutes = router;
