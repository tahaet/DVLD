const AppError = require("../../util/appError");
const logger = require("../../util/logger");

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error(err.message);

  if (process.env.NODE_ENV === "development" && err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if ((process.env.NODE_ENV = "production")) {
    if (err.isOperational)
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    else
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
  }
};

module.exports = globalErrorHandler;
