const PickupPoint = require('../models/PickupPoint');

/**
 * Get all active pickup points
 * GET /api/pickup-points
 */
const getPickupPoints = async (req, res, next) => {
  try {
    const { area, search } = req.query;
    const query = { isActive: true };

    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { landmark: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
      ];
    }

    const points = await PickupPoint.find(query).sort({ area: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: points.length,
      data: points,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new pickup point (Admin only)
 * POST /api/pickup-points
 */
const createPickupPoint = async (req, res, next) => {
  try {
    const { name, address, area, landmark, latitude, longitude } = req.body;

    const point = await PickupPoint.create({
      name,
      address,
      area,
      landmark: landmark || '',
      latitude: latitude || 17.385,
      longitude: longitude || 78.4867,
      createdBy: req.user._id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup point created successfully',
      data: point,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update pickup point (Admin only)
 * PATCH /api/pickup-points/:id
 */
const updatePickupPoint = async (req, res, next) => {
  try {
    const point = await PickupPoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!point) {
      return res.status(404).json({
        success: false,
        message: 'Pickup point not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pickup point updated successfully',
      data: point,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete / deactivate pickup point (Admin only)
 * DELETE /api/pickup-points/:id
 */
const deletePickupPoint = async (req, res, next) => {
  try {
    const point = await PickupPoint.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!point) {
      return res.status(404).json({
        success: false,
        message: 'Pickup point not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pickup point deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPickupPoints,
  createPickupPoint,
  updatePickupPoint,
  deletePickupPoint,
};
