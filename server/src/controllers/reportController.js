const Report = require('../models/Report');

/**
 * Submit an incident or conduct report
 * POST /api/reports
 */
const createReport = async (req, res, next) => {
  try {
    const { reportedUser, tripId, poolId, reason, description } = req.body;

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUser || undefined,
      tripId: tripId || undefined,
      poolId: poolId || undefined,
      reason,
      description,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Campus transport administration will investigate.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reports (Admin only)
 * GET /api/reports
 */
const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email role department phone collegeId')
      .populate('reportedUser', 'name email role department phone collegeId')
      .populate('tripId')
      .populate('resolvedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update report status (Admin only)
 * PATCH /api/reports/:id
 */
const updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    if (status === 'RESOLVED' || status === 'DISMISSED') {
      report.resolvedBy = req.user._id;
      report.resolvedAt = new Date();
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  updateReport,
};
