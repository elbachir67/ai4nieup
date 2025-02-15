import mongoose from "mongoose";

const learningGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["ml", "dl", "data_science", "mlops", "computer_vision", "nlp"],
      required: true,
    },
    requiredConcepts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concept",
      },
    ],
    estimatedDuration: {
      type: Number,
      required: true,
    },
    careerOpportunities: [
      {
        type: String,
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

learningGoalSchema.index({ category: 1, difficulty: 1 });

export const LearningGoal = mongoose.model("LearningGoal", learningGoalSchema);
