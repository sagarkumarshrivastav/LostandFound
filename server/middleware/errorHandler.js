
const errorHandler = (err, req, res, next) => {
  // Log the full error object for detailed debugging
  console.error('--- Unhandled Error ---');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  // console.error('Request Body:', req.body); // Be cautious logging body in production
  console.error('Error Object:', err); // Log the full error object
  // console.error('Error Stack:', err.stack); // Stack trace is often included in err object log
  console.error('--- End Unhandled Error ---');

  // Default error status and message
  let statusCode = err.statusCode || 500; // Use error's status code if available
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Combine multiple validation errors into one message
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key error
   if (err.code === 11000) {
     statusCode = 400;
     const field = Object.keys(err.keyValue)[0];
     const value = err.keyValue[field];
     message = `Duplicate field value entered: '${value}' for field '${field}'. Please use another value.`;
   }

   // JWT errors (can also be handled in authMiddleware, but good fallback)
   if (err.name === 'JsonWebTokenError') {
     statusCode = 401;
     message = 'Not authorized, token failed verification';
   }
   if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Not authorized, token expired';
    }

  // Custom error messages passed via Error object
  // (e.g., new Error('Token signing failed'))
   if (statusCode === 500 && err.message && err.message !== 'Internal Server Error') {
      message = err.message; // Use the custom message from the error object
   }


  // Check if headers have already been sent (prevents error 'ERR_HTTP_HEADERS_SENT')
  if (res.headersSent) {
    console.warn("Headers already sent, skipping error response.");
    return next(err); // Pass error to default Express handler if headers sent
  }

  res.status(statusCode).json({
    success: false, // Add a success flag for consistency
    message: message,
    // Optionally include stack trace in development mode only
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
