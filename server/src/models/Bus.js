const mongoose = require('mongoose');

const busStopSchema = new mongoose.Schema(
  {
    stopName: { type: String, required: true },
    estimatedTime: { type: String, required: true }, // e.g. "07:30"
    order: { type: Number, default: 1 },
  },
  { _id: false }
);

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver phone number is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 10,
      max: 100,
    },
    currentStatus: {
      type: String,
      enum: ['ON_SCHEDULE', 'DELAYED', 'MAINTENANCE', 'COMPLETED'],
      default: 'ON_SCHEDULE',
    },
    route: [busStopSchema],
    pickupPoints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PickupPoint',
      },
    ],
    morningDeparture: {
      type: String,
      default: '07:15',
    },
    eveningReturn: {
      type: String,
      default: '17:15',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
