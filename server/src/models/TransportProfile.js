const mongoose = require('mongoose');

const transportProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    homeLocation: {
      address: { type: String, default: '' },
      area: { type: String, required: true, index: true },
      city: { type: String, default: 'Hyderabad' },
      latitude: { type: Number, default: 17.3850 },
      longitude: { type: Number, default: 78.4867 },
    },
    destination: {
      address: { type: String, default: 'College Main Campus' },
      campusName: { type: String, default: 'Engineering Block' },
      latitude: { type: Number, default: 17.5449 },
      longitude: { type: Number, default: 78.5718 },
    },
    preferredPickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
    },
    travelTime: {
      type: String, // HH:MM in 24-hr e.g. "08:15"
      required: true,
    },
    returnTime: {
      type: String, // HH:MM in 24-hr e.g. "17:00"
      default: '17:00',
    },
    transportType: {
      type: String,
      enum: ['CAR', 'BIKE', 'COLLEGE_BUS', 'PUBLIC_TRANSPORT', 'OTHER'],
      default: 'CAR',
    },
    availableSeats: {
      type: Number,
      default: 1,
      min: 0,
      max: 8,
    },
    requiresRide: {
      type: Boolean,
      default: true,
    },
    offersRide: {
      type: Boolean,
      default: false,
    },
    preferences: {
      genderPreference: {
        type: String,
        enum: ['ANY', 'SAME_GENDER'],
        default: 'ANY',
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      musicAllowed: {
        type: Boolean,
        default: true,
      },
      acAvailable: {
        type: Boolean,
        default: true,
      },
      notes: {
        type: String,
        default: '',
        maxlength: 250,
      },
    },
  },
  {
    timestamps: true,
  }
);

const TransportProfile = mongoose.model('TransportProfile', transportProfileSchema);

module.exports = TransportProfile;
