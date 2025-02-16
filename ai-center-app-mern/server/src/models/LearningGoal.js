import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
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
      required: true,
      enum: ["ml", "dl", "data_science", "mlops", "computer_vision", "nlp"],
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    careerOpportunities: [
      {
        type: String,
        required: true,
      },
    ],
    requiredConcepts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concept",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index pour améliorer les performances des requêtes
goalSchema.index({ category: 1, difficulty: 1 });

export const Goal = mongoose.model("Goal", goalSchema);
