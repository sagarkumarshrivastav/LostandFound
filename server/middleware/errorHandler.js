
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);

  // Default error status and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = 'Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found (Invalid ID)';
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
     message = `Duplicate field value entered for ${field}. Please use another value.`;
   }

   // JWT errors (can also be handled in authMiddleware, but good fallback)
   if (err.name === 'JsonWebTokenError') {
     statusCode = 401;
     message = 'Not authorized, token failed';
   }
   if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Not authorized, token expired';
    }

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    message: message,
    // Optionally include stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
