function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.json({
    success: false,
    message: statusCode >= 500 && isProd ? "Something went wrong" : err.message || "Server error",
    errors: isProd ? undefined : err.errors ? err.errors : undefined
  });
}

module.exports = { notFound, errorHandler };
