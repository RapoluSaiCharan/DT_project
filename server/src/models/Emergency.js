const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pool',
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    location: {
      address: { type: String, default: 'Campus Vicinity Route' },
      latitude: { type: Number, default: 17.385 },
      longitude: { type: Number, default: 78.4867 },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INVESTIGATING', 'RESOLVED', 'FALSE_ALARM'],
      default: 'ACTIVE',
      index: true,
    },
    note: {
      type: String,
      default: 'SOS Alert triggered via mobile platform',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Emergency = mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;
