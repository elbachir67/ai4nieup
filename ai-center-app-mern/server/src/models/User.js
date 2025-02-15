import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  progress: [{
    step: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Step'
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Check password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);