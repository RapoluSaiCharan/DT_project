const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pool',
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      enum: [
        'DANGEROUS_DRIVING',
        'HARASSMENT',
        'NO_SHOW',
        'INAPPROPRIATE_BEHAVIOR',
        'OVERCHARGING',
        'VEHICLE_CONDITION',
        'ROUTE_DEVIATION',
        'OTHER',
      ],
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
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

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
