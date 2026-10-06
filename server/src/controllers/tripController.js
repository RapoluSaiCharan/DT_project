const Trip = require('../models/Trip');
const Pool = require('../models/Pool');
const { calculateTripCost } = require('../services/costService');
const { sendNotification, sendBulkNotifications } = require('../services/notificationService');

/**
 * Create/Start a trip from a pool
 * POST /api/trips/start
 */
const startTripFromPool = async (req, res, next) => {
  try {
    const { poolId } = req.body;
    const pool = await Pool.findById(poolId).populate('members.user');

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Pool not found',
      });
    }

    // Only driver or admin can start trip
    if (
      pool.driver.toString() !== req.user._id.toString() &&
      !['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the designated driver can start this trip.',
      });
    }

    const confirmedPassengers = pool.members
      .filter((m) => m.status === 'CONFIRMED')
      .map((m) => m.user._id || m.user);

    // Initial cost per person
    const passengerCount = confirmedPassengers.length;
    const { costPerPerson } = calculateTripCost({
      totalCost: pool.estimatedCostTotal || 150,
      passengerCount: passengerCount > 0 ? passengerCount : 1,
      driverContribution: 0,
    });

    const trip = await Trip.create({
      poolId: pool._id,
      driverId: pool.driver,
      passengerIds: confirmedPassengers,
      origin: pool.origin.area,
      destination: pool.destination.address,
      pickupPoint: pool.pickupPoint,
      departureTime: new Date(),
      status: 'STARTED',
      totalCost: pool.estimatedCostTotal,
      costPerPerson: costPerPerson,
    });

    pool.status = 'ACTIVE';
    await pool.save();

    // Notify passengers that trip has started
    if (confirmedPassengers.length > 0) {
      await sendBulkNotifications(confirmedPassengers, {
        type: 'TRIP_START',
        title: 'Trip Started! 🚗',
        message: `Your pool trip "${pool.name}" has started. Driver is en-route.`,
        relatedId: trip._id.toString(),
        actionUrl: `/trips/${trip._id}`,
      });
    }

    const populatedTrip = await Trip.findById(trip._id)
      .populate('driverId', 'name email phone department')
      .populate('passengerIds', 'name email phone department')
      .populate('poolId');

    res.status(201).json({
      success: true,
      message: 'Trip started successfully.',
      data: populatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trips for current user
 * GET /api/trips
 */
const getTrips = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [{ driverId: req.user._id }, { passengerIds: req.user._id }],
    };

    if (status) {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .populate('driverId', 'name email phone department isVerified')
      .populate('passengerIds', 'name email phone department')
      .populate('poolId', 'name transportType recurrenceDays')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trip by ID
 * GET /api/trips/:id
 */
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('driverId', 'name email phone department isVerified')
      .populate('passengerIds', 'name email phone department')
      .populate('poolId')
      .populate('pickupPoint');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update trip status (e.g. COMPLETED or CANCELLED)
 * PATCH /api/trips/:id/status
 */
const updateTripStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Only driver or admin
    if (
      trip.driverId.toString() !== req.user._id.toString() &&
      !['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to change trip status.',
      });
    }

    trip.status = status;
    if (status === 'COMPLETED') {
      trip.arrivalTime = new Date();

      // Notify passengers to rate the trip
      await sendBulkNotifications(trip.passengerIds, {
        type: 'TRIP_COMPLETE',
        title: 'Trip Completed! 🎉',
        message: 'Your ride has reached the destination safely. Please submit your feedback and rating.',
        relatedId: trip._id.toString(),
        actionUrl: `/trips/${trip._id}`,
      });
    }

    await trip.save();

    res.status(200).json({
      success: true,
      message: `Trip marked as ${status}.`,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate & set cost sharing for a trip
 * POST /api/trips/:id/cost
 */
const updateTripCost = async (req, res, next) => {
  try {
    const { totalCost, driverContribution } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    const passengerCount = trip.passengerIds.length;
    const calculation = calculateTripCost({
      totalCost,
      passengerCount,
      driverContribution: driverContribution || 0,
    });

    trip.totalCost = calculation.totalCost;
    trip.driverContribution = calculation.driverContribution;
    trip.costPerPerson = calculation.costPerPerson;

    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip cost calculated and updated successfully.',
      data: {
        trip,
        breakdown: calculation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get cost calculation details
 * GET /api/trips/:id/cost
 */
const getTripCost = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    const calculation = calculateTripCost({
      totalCost: trip.totalCost,
      passengerCount: trip.passengerIds.length,
      driverContribution: trip.driverContribution || 0,
    });

    res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startTripFromPool,
  getTrips,
  getTripById,
  updateTripStatus,
  updateTripCost,
  getTripCost,
};
