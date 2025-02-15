import mongoose from "mongoose";

const learnerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "reading", "kinesthetic"],
      required: true,
    },
    preferences: {
      mathLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true,
      },
      programmingLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true,
      },
      preferredDomain: {
        type: String,
        enum: ["ml", "dl", "computer_vision", "nlp", "mlops"],
        required: true,
      },
    },
    progress: [
      {
        step: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Step",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],
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
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    goals: [
      {
        title: String,
        targetDate: Date,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    certificates: [
      {
        title: String,
        issuer: String,
        date: Date,
        url: String,
      },
    ],
    skills: [
      {
        name: String,
        level: {
          type: Number,
          min: 1,
          max: 5,
        },
        endorsements: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
learnerProfileSchema.index({ userId: 1 }, { unique: true });
learnerProfileSchema.index({ "progress.step": 1 });
learnerProfileSchema.index({ "skills.name": 1 });
learnerProfileSchema.index({ "assessments.category": 1 });

export const LearnerProfile = mongoose.model(
  "LearnerProfile",
  learnerProfileSchema
);
