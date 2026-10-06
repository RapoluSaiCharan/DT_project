const mongoose = require('mongoose');

const pickupPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pickup point name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area/Locality is required'],
      trim: true,
      index: true,
    },
    landmark: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      default: 17.3850,
    },
    longitude: {
      type: Number,
      required: true,
      default: 78.4867,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const PickupPoint = mongoose.model('PickupPoint', pickupPointSchema);

module.exports = PickupPoint;
