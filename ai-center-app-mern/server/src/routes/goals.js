import express from "express";
import { body } from "express-validator";
import { LearningGoal } from "../models/LearningGoal.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Get all learning goals with filters
router.get("/", async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const goals = await LearningGoal.find(query)
      .populate("requiredConcepts")
      .sort("category");

    res.json(goals);
  } catch (error) {
    logger.error("Error fetching learning goals:", error);
    res.status(500).json({ error: "Error fetching learning goals" });
  }
});

// Get a specific learning goal
router.get("/:id", async (req, res) => {
  try {
    const goal = await LearningGoal.findById(req.params.id).populate(
      "requiredConcepts"
    );

    if (!goal) {
      return res.status(404).json({ error: "Learning goal not found" });
    }

    res.json(goal);
  } catch (error) {
    logger.error("Error fetching learning goal:", error);
    res.status(500).json({ error: "Error fetching learning goal" });
  }
});

export const goalRoutes = router;
