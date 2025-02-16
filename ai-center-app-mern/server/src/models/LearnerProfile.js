import mongoose from "mongoose";

const learnerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "reading", "kinesthetic"],
      required: true,
      default: "visual",
    },
    preferences: {
      mathLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true,
        default: "beginner",
      },
      programmingLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true,
        default: "beginner",
      },
      preferredDomain: {
        type: String,
        enum: ["ml", "dl", "computer_vision", "nlp", "mlops"],
        required: true,
        default: "ml",
      },
    },
    assessments: [
      {
        category: {
          type: String,
          enum: ["math", "programming", "ml", "dl", "computer_vision", "nlp"],
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        responses: [
          {
            questionId: String,
            selectedOption: String,
            timeSpent: Number,
          },
        ],
        recommendations: [String],
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
learnerProfileSchema.index({ userId: 1 });
learnerProfileSchema.index({ "assessments.category": 1 });

export const LearnerProfile = mongoose.model(
  "LearnerProfile",
  learnerProfileSchema
);
