const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pool',
      required: true,
      index: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    passengerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    pickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
    },
    departureTime: {
      type: Date,
      default: Date.now,
    },
    arrivalTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED', 'EMERGENCY'],
      default: 'SCHEDULED',
      index: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    costPerPerson: {
      type: Number,
      default: 0,
      min: 0,
    },
    driverContribution: {
      type: Number,
      default: 0,
    },
    emergencyStatus: {
      type: Boolean,
      default: false,
    },
    emergencyNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
