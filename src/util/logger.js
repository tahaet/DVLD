// logger.js
const winston = require("winston");

// Create a logger instance with custom settings
const logger = winston.createLogger({
  level: "info", // Set default log level to 'info'
  format: winston.format.combine(
    winston.format.colorize(), // Colorize the output
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`; // Custom log format
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: `${__dirname}/../../../DVLD`,
      filename: "app.log",
    }),
  ],
});

module.exports = logger;
