const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || res.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};