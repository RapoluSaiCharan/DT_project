const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'POOL_JOIN',
        'POOL_LEAVE',
        'POOL_CANCELLED',
        'TRIP_START',
        'TRIP_COMPLETE',
        'SAFETY_ALERT',
        'REPORT_UPDATE',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: String,
      default: '',
    },
    actionUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
