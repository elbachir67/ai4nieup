import express from "express";
import { Assessment } from "../models/Assessment.js";
import { LearningGoal } from "../models/LearningGoal.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Get assessment questions by category
router.get("/questions", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let query = {};

    if (category) {
      query.category = category.toLowerCase();
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const assessments = await Assessment.find(query)
      .populate("recommendedGoals")
      .select("-createdAt -updatedAt -__v");

    // Format questions for the frontend
    const questions = assessments.flatMap(assessment =>
      assessment.questions.map(q => ({
        id: q._id.toString(),
        text: q.text,
        category: assessment.category,
        difficulty: assessment.difficulty,
        options: q.options.map(opt => ({
          id: opt._id.toString(),
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        explanation: q.explanation,
        recommendedGoals: assessment.recommendedGoals,
      }))
    );

    res.json(questions);
  } catch (error) {
    logger.error("Error fetching assessment questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// Submit assessment results and get recommendations
router.post("/submit", async (req, res) => {
  try {
    const { responses, userProfile } = req.body;

    // Calculate scores by category
    const categoryScores = {};
    responses.forEach(response => {
      const category = response.category;
      if (!categoryScores[category]) {
        categoryScores[category] = {
          correct: 0,
          total: 0,
        };
      }
      categoryScores[category].total++;
      if (response.isCorrect) {
        categoryScores[category].correct++;
      }
    });

    // Calculate percentages and get recommended goals
    const recommendations = [];
    for (const [category, scores] of Object.entries(categoryScores)) {
      const percentage = (scores.correct / scores.total) * 100;

      // Find appropriate goals based on score and user profile
      const difficulty =
        percentage >= 80
          ? "advanced"
          : percentage >= 50
          ? "intermediate"
          : "beginner";

      const recommendedGoals = await Goal.find({
        category,
        difficulty,
        // Add additional filters based on user profile if needed
      }).limit(3);

      recommendations.push({
        category,
        score: percentage,
        goals: recommendedGoals,
      });
    }

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    logger.error("Error submitting assessment:", error);
    res.status(500).json({ error: "Error submitting assessment" });
  }
});

export const assessmentRoutes = router;
