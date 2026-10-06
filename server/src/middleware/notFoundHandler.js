const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - Route ${req.originalUrl} does not exist on this server.`,
  });
};

module.exports = notFoundHandler;
