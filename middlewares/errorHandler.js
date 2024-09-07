const config = require('../config');

function errorHandler(err, req, res, next) {
    // Log the error details based on the log level from config
    if (config.logLevel === 'debug' || config.logLevel === 'error') {
        console.error(err.stack || err);
    }

    // Determine the status code based on the error type
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'An unexpected error occurred';

    // Send a JSON response with the error details
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            ...(config.includeStackTrace && { stack: err.stack }) // Include stack trace based on config
        }
    });
}

module.exports = errorHandler;
