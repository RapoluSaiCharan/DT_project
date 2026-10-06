const Emergency = require('../models/Emergency');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { sendBulkNotifications } = require('../services/notificationService');

/**
 * Trigger SOS Emergency Alert
 * POST /api/safety/sos
 */
const triggerSOS = async (req, res, next) => {
  try {
    const { tripId, poolId, location, note } = req.body;

    // Find active trip if tripId not passed explicitly
    let associatedTrip = null;
    if (tripId) {
      associatedTrip = await Trip.findById(tripId);
    } else {
      associatedTrip = await Trip.findOne({
        $or: [{ driverId: req.user._id }, { passengerIds: req.user._id }],
        status: { $in: ['STARTED', 'SCHEDULED'] },
      });
    }

    if (associatedTrip) {
      associatedTrip.status = 'EMERGENCY';
      associatedTrip.emergencyStatus = true;
      associatedTrip.emergencyNotes = note || 'SOS alert activated by commuter';
      await associatedTrip.save();
    }

    const emergency = await Emergency.create({
      tripId: associatedTrip ? associatedTrip._id : undefined,
      poolId: poolId || (associatedTrip ? associatedTrip.poolId : undefined),
      triggeredBy: req.user._id,
      location: {
        address: location?.address || 'Campus Commute Route',
        latitude: location?.latitude || 17.385,
        longitude: location?.longitude || 78.4867,
      },
      note: note || 'Immediate SOS alert triggered from mobile application',
      status: 'ACTIVE',
    });

    // Notify all Admins immediately
    const admins = await User.find({
      role: { $in: ['TRANSPORT_ADMIN', 'SUPER_ADMIN'] },
      isActive: true,
    }).select('_id');

    const adminIds = admins.map((a) => a._id);
    if (adminIds.length > 0) {
      await sendBulkNotifications(adminIds, {
        type: 'SAFETY_ALERT',
        title: '🚨 CRITICAL SOS ALERT',
        message: `SOS Triggered by ${req.user.name} (${req.user.department}, Phone: ${req.user.phone})!`,
        relatedId: emergency._id.toString(),
        actionUrl: `/admin/reports`,
      });
    }

    // Populate user details
    const populated = await Emergency.findById(emergency._id).populate(
      'triggeredBy',
      'name email phone department collegeId'
    );

    res.status(201).json({
      success: true,
      message: 'Emergency alert sent to configured college contacts and security desk.',
      data: {
        emergency: populated,
        dispatchedNotice: 'Emergency alert sent to configured college contacts.',
        hotlines: [
          { name: 'Campus Security Control Room', number: '+91 40 2345 6789' },
          { name: 'Transport Coordinator Desk', number: '+91 98765 43210' },
          { name: 'Student Safety Cell', number: '+91 98765 11223' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active emergencies (Admin)
 * GET /api/safety/active
 */
const getActiveEmergencies = async (req, res, next) => {
  try {
    const emergencies = await Emergency.find({ status: 'ACTIVE' })
      .populate('triggeredBy', 'name email phone department collegeId')
      .populate('tripId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: emergencies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resolve emergency (Admin)
 * PATCH /api/safety/:id/resolve
 */
const resolveEmergency = async (req, res, next) => {
  try {
    const { status = 'RESOLVED', note } = req.body;
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency record not found',
      });
    }

    emergency.status = status;
    emergency.resolvedBy = req.user._id;
    emergency.resolvedAt = new Date();
    if (note) emergency.note = `${emergency.note} | Admin Note: ${note}`;

    await emergency.save();

    // If trip exists, restore status
    if (emergency.tripId) {
      const trip = await Trip.findById(emergency.tripId);
      if (trip && trip.status === 'EMERGENCY') {
        trip.emergencyStatus = false;
        trip.status = 'COMPLETED';
        await trip.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Emergency incident updated and marked resolved.',
      data: emergency,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerSOS,
  getActiveEmergencies,
  resolveEmergency,
};
