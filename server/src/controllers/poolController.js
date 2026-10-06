const Pool = require('../models/Pool');
const PickupPoint = require('../models/PickupPoint');
const { sendNotification } = require('../services/notificationService');

/**
 * Create a new transport pool
 * POST /api/pools
 */
const createPool = async (req, res, next) => {
  try {
    const {
      name,
      origin,
      destination,
      pickupPoint,
      departureTime,
      estimatedArrival,
      transportType,
      totalSeats,
      estimatedCostTotal,
      recurring,
      recurrenceDays,
      notes,
    } = req.body;

    const totalSeatsNum = parseInt(totalSeats, 10) || 3;
    const estimatedCostTotalNum = parseFloat(estimatedCostTotal) || 120;
    const costPerPerson = Math.round(estimatedCostTotalNum / (totalSeatsNum + 1));

    const pool = await Pool.create({
      name,
      creator: req.user._id,
      driver: req.user._id,
      members: [],
      origin: {
        address: origin?.address || origin?.area || 'Pickup Point',
        area: origin?.area,
        latitude: origin?.latitude || 17.385,
        longitude: origin?.longitude || 78.4867,
      },
      destination: {
        address: destination?.address || 'College Campus',
        campusName: destination?.campusName || 'Main Campus',
      },
      pickupPoint: pickupPoint || undefined,
      departureTime,
      estimatedArrival: estimatedArrival || '08:50',
      transportType: transportType || 'CAR',
      totalSeats: totalSeatsNum,
      availableSeats: totalSeatsNum,
      estimatedCostTotal: estimatedCostTotalNum,
      costPerPerson,
      recurring: recurring !== undefined ? recurring : true,
      recurrenceDays: recurrenceDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: notes || '',
      status: 'OPEN',
    });

    const populatedPool = await Pool.findById(pool._id)
      .populate('driver', 'name email role department isVerified phone')
      .populate('pickupPoint');

    res.status(201).json({
      success: true,
      message: 'Transport pool created successfully.',
      data: populatedPool,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all transport pools with optional filters
 * GET /api/pools
 */
const getPools = async (req, res, next) => {
  try {
    const { status, originArea, transportType, myPools } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      // By default show open and active pools
      query.status = { $in: ['OPEN', 'ACTIVE'] };
    }

    if (originArea) {
      query['origin.area'] = { $regex: originArea, $options: 'i' };
    }

    if (transportType && transportType !== 'ALL') {
      query.transportType = transportType;
    }

    if (myPools === 'created') {
      query.creator = req.user._id;
      delete query.status; // see all statuses for own pools
    } else if (myPools === 'joined') {
      query['members.user'] = req.user._id;
      delete query.status;
    }

    const pools = await Pool.find(query)
      .populate('driver', 'name email role department isVerified phone')
      .populate('members.user', 'name email role department')
      .populate('pickupPoint')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pools.length,
      data: pools,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single pool by ID
 * GET /api/pools/:id
 */
const getPoolById = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id)
      .populate('creator', 'name email role department phone')
      .populate('driver', 'name email role department isVerified phone')
      .populate('members.user', 'name email role department phone')
      .populate('members.pickupPoint')
      .populate('pickupPoint');

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Transport pool not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pool,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Join an existing transport pool
 * POST /api/pools/:id/join
 */
const joinPool = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id).populate('driver');
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Transport pool not found',
      });
    }

    if (pool.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: `Cannot join pool. Current status is ${pool.status}.`,
      });
    }

    // Check if user is the driver
    if (pool.driver._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the driver/creator of this pool and cannot join as a passenger.',
      });
    }

    // Check if already a member
    const alreadyMember = pool.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.status !== 'CANCELLED'
    );
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this transport pool.',
      });
    }

    const seatsRequested = parseInt(req.body.seatsRequested, 10) || 1;
    if (pool.availableSeats < seatsRequested) {
      return res.status(400).json({
        success: false,
        message: `Only ${pool.availableSeats} seat(s) available in this pool.`,
      });
    }

    // Add member
    pool.members.push({
      user: req.user._id,
      pickupPoint: req.body.pickupPoint || pool.pickupPoint,
      seatsRequested,
      status: 'CONFIRMED',
      joinedAt: new Date(),
    });

    pool.availableSeats -= seatsRequested;
    if (pool.availableSeats === 0) {
      pool.status = 'FULL';
    }

    // Recalculate cost per person
    const activePassengerCount = pool.members.filter((m) => m.status === 'CONFIRMED').length;
    pool.costPerPerson = Math.round(pool.estimatedCostTotal / (activePassengerCount + 1));

    await pool.save();

    // Send notification to pool driver
    await sendNotification({
      recipient: pool.driver._id,
      type: 'POOL_JOIN',
      title: 'New Member Joined Your Pool',
      message: `${req.user.name} (${req.user.department}) joined your pool "${pool.name}".`,
      relatedId: pool._id.toString(),
      actionUrl: `/pools/${pool._id}`,
    });

    // Send notification to the joining user
    await sendNotification({
      recipient: req.user._id,
      type: 'POOL_JOIN',
      title: 'Pool Joined Successfully',
      message: `You joined "${pool.name}" driven by ${pool.driver.name}. Pickup: ${pool.departureTime}.`,
      relatedId: pool._id.toString(),
      actionUrl: `/pools/${pool._id}`,
    });

    const updatedPool = await Pool.findById(pool._id)
      .populate('driver', 'name email role department isVerified phone')
      .populate('members.user', 'name email role department phone')
      .populate('pickupPoint');

    res.status(200).json({
      success: true,
      message: 'Successfully joined the transport pool!',
      data: updatedPool,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a transport pool
 * POST /api/pools/:id/leave
 */
const leavePool = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Transport pool not found',
      });
    }

    const memberIndex = pool.members.findIndex(
      (m) => m.user.toString() === req.user._id.toString() && m.status !== 'CANCELLED'
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not an active member of this transport pool.',
      });
    }

    const seatsFreed = pool.members[memberIndex].seatsRequested || 1;
    pool.members.splice(memberIndex, 1);
    pool.availableSeats += seatsFreed;

    if (pool.status === 'FULL' && pool.availableSeats > 0) {
      pool.status = 'OPEN';
    }

    const activeCount = pool.members.filter((m) => m.status === 'CONFIRMED').length;
    pool.costPerPerson = Math.round(pool.estimatedCostTotal / (activeCount + 1));

    await pool.save();

    // Notify driver
    await sendNotification({
      recipient: pool.driver,
      type: 'POOL_LEAVE',
      title: 'Member Left Pool',
      message: `${req.user.name} has left your pool "${pool.name}".`,
      relatedId: pool._id.toString(),
    });

    res.status(200).json({
      success: true,
      message: 'You have left the transport pool.',
      data: pool,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update pool details
 * PATCH /api/pools/:id
 */
const updatePool = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Pool not found',
      });
    }

    const isAuthorized =
      pool.creator.toString() === req.user._id.toString() ||
      ['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this pool',
      });
    }

    const updated = await Pool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('driver', 'name email role department isVerified phone')
      .populate('members.user', 'name role department')
      .populate('pickupPoint');

    res.status(200).json({
      success: true,
      message: 'Pool updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a pool
 * POST /api/pools/:id/cancel
 */
const cancelPool = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Pool not found',
      });
    }

    const isAuthorized =
      pool.creator.toString() === req.user._id.toString() ||
      ['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this pool',
      });
    }

    pool.status = 'CANCELLED';
    await pool.save();

    // Notify all members
    const memberIds = pool.members.map((m) => m.user);
    for (const memId of memberIds) {
      await sendNotification({
        recipient: memId,
        type: 'POOL_CANCELLED',
        title: 'Pool Cancelled',
        message: `The pool "${pool.name}" scheduled for ${pool.departureTime} has been cancelled by the host.`,
        relatedId: pool._id.toString(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pool cancelled successfully and members have been notified.',
      data: pool,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pool (hard delete by creator or admin)
 * DELETE /api/pools/:id
 */
const deletePool = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Pool not found',
      });
    }

    const isAuthorized =
      pool.creator.toString() === req.user._id.toString() ||
      ['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this pool',
      });
    }

    await Pool.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pool deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPool,
  getPools,
  getPoolById,
  joinPool,
  leavePool,
  updatePool,
  cancelPool,
  deletePool,
};
