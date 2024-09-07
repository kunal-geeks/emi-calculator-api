/**
 * Middleware function to handle errors and send a response.
 * 
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function errorHandler(err, req, res, next) {
  // Log the error details for debugging
  console.error(err.stack || err);

  // Determine the status code based on the error type
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'An unexpected error occurred';

  // Send a JSON response with the error details
  res.status(statusCode).json({
      error: {
          message: errorMessage,
          // Optionally include additional details in development mode
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
  });
}

module.exports = errorHandler;

  