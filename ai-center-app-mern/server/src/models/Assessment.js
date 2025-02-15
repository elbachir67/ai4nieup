import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['math', 'programming', 'ml', 'dl', 'computer_vision', 'nlp']
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  responses: [{
    questionId: String,
    selectedOption: String,
    correct: Boolean,
    timeSpent: Number
  }],
  recommendations: [{
    type: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
assessmentSchema.index({ user: 1, category: 1 });

export const Assessment = mongoose.model('Assessment', assessmentSchema);