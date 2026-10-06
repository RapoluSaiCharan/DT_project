const mongoose = require('mongoose');

const poolMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
    },
    seatsRequested: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const poolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pool name is required'],
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [poolMemberSchema],
    origin: {
      address: { type: String, required: true },
      area: { type: String, required: true, index: true },
      latitude: { type: Number, default: 17.385 },
      longitude: { type: Number, default: 78.4867 },
    },
    destination: {
      address: { type: String, default: 'College Main Campus' },
      campusName: { type: String, default: 'Main Gate' },
      latitude: { type: Number, default: 17.5449 },
      longitude: { type: Number, default: 78.5718 },
    },
    pickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
    },
    departureTime: {
      type: String, // "08:15"
      required: true,
    },
    estimatedArrival: {
      type: String, // "08:50"
      default: '08:50',
    },
    transportType: {
      type: String,
      enum: ['CAR', 'BIKE', 'COLLEGE_BUS', 'OTHER'],
      default: 'CAR',
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    estimatedCostTotal: {
      type: Number,
      default: 150,
      min: 0,
    },
    costPerPerson: {
      type: Number,
      default: 50,
      min: 0,
    },
    status: {
      type: String,
      enum: ['OPEN', 'FULL', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN',
      index: true,
    },
    recurring: {
      type: Boolean,
      default: true,
    },
    recurrenceDays: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for matching queries
poolSchema.index({ 'origin.area': 1, status: 1 });
poolSchema.index({ departureTime: 1, status: 1 });

const Pool = mongoose.model('Pool', poolSchema);

module.exports = Pool;
