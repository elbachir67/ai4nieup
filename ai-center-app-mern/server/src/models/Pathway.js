import mongoose from "mongoose";

const pathwayConceptSchema = new mongoose.Schema({
  concept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Concept",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  startedAt: Date,
  completedAt: Date,
});

const pathwaySchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearnerProfile",
      required: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningGoal",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    conceptSequence: [pathwayConceptSchema],
    estimatedDuration: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    analytics: {
      startDate: {
        type: Date,
        default: Date.now,
      },
      completedConcepts: {
        type: Number,
        default: 0,
      },
      timeSpent: {
        type: Number,
        default: 0,
      },
      assessmentScores: [
        {
          conceptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Concept",
          },
          score: Number,
          attemptCount: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

pathwaySchema.index({ learnerId: 1, status: 1 });
pathwaySchema.index({ goalId: 1 });

export const Pathway = mongoose.model("Pathway", pathwaySchema);
