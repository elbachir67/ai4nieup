import express from "express";
import { body } from "express-validator";
import { Goal } from "../models/LearningGoal.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all goals with filters
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

    const goals = await Goal.find(query)
      .populate("requiredConcepts")
      .sort("category");

    res.json(goals);
  } catch (error) {
    logger.error("Error fetching goals:", error);
    res.status(500).json({ error: "Error fetching goals" });
  }
});

// Get a specific goal
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid goal ID format" });
    }

    const goal = await Goal.findById(req.params.id).populate(
      "requiredConcepts"
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    logger.error("Error fetching goal:", error);
    res.status(500).json({ error: "Error fetching goal" });
  }
});

// Create a new goal (admin only)
router.post(
  "/",
  adminAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category")
      .isIn(["ml", "dl", "data_science", "mlops", "computer_vision", "nlp"])
      .withMessage("Invalid category"),
    body("estimatedDuration")
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive number"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
    body("careerOpportunities")
      .isArray()
      .withMessage("Career opportunities must be an array"),
  ],
  validate,
  async (req, res) => {
    try {
      const goal = new Goal(req.body);
      await goal.save();

      logger.info(`New goal created: ${goal.title}`);
      res.status(201).json(goal);
    } catch (error) {
      logger.error("Error creating goal:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update a goal (admin only)
router.put(
  "/:id",
  adminAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category")
      .isIn(["ml", "dl", "data_science", "mlops", "computer_vision", "nlp"])
      .withMessage("Invalid category"),
    body("estimatedDuration")
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive number"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
    body("careerOpportunities")
      .isArray()
      .withMessage("Career opportunities must be an array"),
  ],
  validate,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid goal ID format" });
      }

      const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("requiredConcepts");

      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      logger.info(`Goal updated: ${goal.title}`);
      res.json(goal);
    } catch (error) {
      logger.error("Error updating goal:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete a goal (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid goal ID format" });
    }

    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    logger.info(`Goal deleted: ${goal.title}`);
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    logger.error("Error deleting goal:", error);
    res.status(500).json({ error: error.message });
  }
});

export const goalRoutes = router;
