import express from "express";
import { body } from "express-validator";
import { ConceptAssessment } from "../models/ConceptAssessment.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

const router = express.Router();

// Get questions for assessment
router.get("/questions", async (req, res) => {
  try {
    const { domain } = req.query;

    // Construire la requête en fonction du domaine
    let query = {};
    if (domain) {
      // Mapper le domaine aux catégories de concepts appropriées
      const categoryMap = {
        "machine learning": "ml",
        "deep learning": "dl",
        "computer vision": "computer_vision",
        nlp: "nlp",
        mlops: "mlops",
      };

      const category = categoryMap[domain.toLowerCase()];
      if (category) {
        query = { "concept.category": category };
      }
    }

    // Récupérer les évaluations avec leurs concepts associés
    const assessments = await ConceptAssessment.find(query)
      .populate("conceptId")
      .sort({ difficulty: 1 });

    // Transformer les données pour le format attendu par le frontend
    const questions = assessments.flatMap(assessment =>
      assessment.questions.map(q => ({
        id: q._id.toString(),
        text: q.text,
        category: assessment.conceptId.category,
        difficulty: assessment.difficulty,
        options: q.options.map(opt => ({
          id: opt._id.toString(),
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        explanation: q.explanation,
      }))
    );

    res.json(questions);
  } catch (error) {
    logger.error("Error fetching assessment questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// Submit assessment results
router.post(
  "/submit",
  [
    body("category").isString(),
    body("score").isNumeric(),
    body("responses").isArray(),
    body("recommendations").isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      const { category, score, responses, recommendations } = req.body;

      // Create a temporary profile for anonymous users
      const anonymousId = new mongoose.Types.ObjectId();

      // Create assessment result
      const assessmentResult = {
        category,
        score,
        responses,
        recommendations,
        completedAt: new Date(),
      };

      // Save assessment result
      const profile = await LearnerProfile.findOneAndUpdate(
        { userId: req.user?._id || anonymousId },
        {
          $push: { assessments: assessmentResult },
        },
        {
          new: true,
          upsert: true,
        }
      );

      logger.info(
        `Assessment completed for category ${category} with score ${score}`
      );
      res.status(201).json({
        success: true,
        assessmentId: profile.assessments[profile.assessments.length - 1]._id,
      });
    } catch (error) {
      logger.error("Assessment submission error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get assessment history
router.get("/history", async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({
      userId: req.user?._id,
    });

    if (!profile) {
      return res.json([]);
    }

    const assessments = profile.assessments || [];
    res.json(assessments);
  } catch (error) {
    logger.error("Assessment history fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

export const assessmentRoutes = router;
