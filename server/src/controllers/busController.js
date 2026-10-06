const Bus = require('../models/Bus');

/**
 * Get all buses
 * GET /api/buses
 */
const getBuses = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { isActive: true };

    if (status) {
      query.currentStatus = status;
    }

    if (search) {
      query.$or = [
        { busNumber: { $regex: search, $options: 'i' } },
        { routeName: { $regex: search, $options: 'i' } },
        { driverName: { $regex: search, $options: 'i' } },
      ];
    }

    const buses = await Bus.find(query)
      .populate('pickupPoints')
      .sort({ busNumber: 1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single bus
 * GET /api/buses/:id
 */
const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('pickupPoints');
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'College bus not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new bus (Admin only)
 * POST /api/buses
 */
const createBus = async (req, res, next) => {
  try {
    const {
      busNumber,
      routeName,
      driverName,
      driverPhone,
      capacity,
      route,
      pickupPoints,
      morningDeparture,
      eveningReturn,
    } = req.body;

    const bus = await Bus.create({
      busNumber,
      routeName,
      driverName,
      driverPhone,
      capacity: parseInt(capacity, 10) || 40,
      route: route || [],
      pickupPoints: pickupPoints || [],
      morningDeparture: morningDeparture || '07:15',
      eveningReturn: eveningReturn || '17:15',
      currentStatus: 'ON_SCHEDULE',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'College bus route added successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update bus details (Admin only)
 * PATCH /api/buses/:id
 */
const updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('pickupPoints');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete bus (Admin only)
 * DELETE /api/buses/:id
 */
const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
};
