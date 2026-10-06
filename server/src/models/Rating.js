const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    role: {
      type: String,
      enum: ['AS_DRIVER', 'AS_PASSENGER'],
      default: 'AS_PASSENGER',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings for same trip and pair
ratingSchema.index({ tripId: 1, rater: 1, ratee: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
