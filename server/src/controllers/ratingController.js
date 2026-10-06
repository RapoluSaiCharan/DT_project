const Rating = require('../models/Rating');
const Trip = require('../models/Trip');

/**
 * Submit rating for a participant on a completed trip
 * POST /api/ratings
 */
const submitRating = async (req, res, next) => {
  try {
    const { tripId, ratee, score, feedback, role } = req.body;

    // Check if trip exists and is completed
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (trip.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'You can only submit ratings for completed trips.',
      });
    }

    // Ensure rater cannot rate themselves
    if (req.user._id.toString() === ratee.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself.',
      });
    }

    // Verify both rater and ratee were part of the trip
    const allParticipants = [trip.driverId.toString(), ...trip.passengerIds.map((p) => p.toString())];
    if (!allParticipants.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You were not a participant in this trip.',
      });
    }
    if (!allParticipants.includes(ratee.toString())) {
      return res.status(400).json({
        success: false,
        message: 'The person you are trying to rate was not part of this trip.',
      });
    }

    // Check duplicate
    const existing = await Rating.findOne({
      tripId,
      rater: req.user._id,
      ratee,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a rating for this member on this trip.',
      });
    }

    const rating = await Rating.create({
      tripId,
      rater: req.user._id,
      ratee,
      score: parseInt(score, 10),
      feedback: feedback || '',
      role: role || (ratee.toString() === trip.driverId.toString() ? 'AS_DRIVER' : 'AS_PASSENGER'),
    });

    res.status(201).json({
      success: true,
      message: 'Rating and feedback submitted successfully. Thank you!',
      data: rating,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already rated this participant for this trip.',
      });
    }
    next(error);
  }
};

/**
 * Get ratings and average score for a user
 * GET /api/users/:id/ratings
 */
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ ratee: req.params.id })
      .populate('rater', 'name role department')
      .sort({ createdAt: -1 });

    const totalRatings = ratings.length;
    const averageScore =
      totalRatings > 0
        ? Math.round((ratings.reduce((acc, curr) => acc + curr.score, 0) / totalRatings) * 10) / 10
        : 5.0; // Default new user score

    res.status(200).json({
      success: true,
      data: {
        totalRatings,
        averageScore,
        ratings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  getUserRatings,
};
