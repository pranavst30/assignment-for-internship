class ApiError extends Error {
    constructor(statusCode, message, error = null) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let error = err.error || 'SERVER_ERROR';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
        error = 'VALIDATION_ERROR';
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        error = 'DUPLICATE_KEY';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        error = 'INVALID_ID';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        error = 'INVALID_TOKEN';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
        error = 'TOKEN_EXPIRED';
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            statusCode,
            message,
            error,
            stack: err.stack,
        });
    }

    res.status(statusCode).json({
        success: false,
        message,
        error,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    ApiError,
    notFound,
    errorHandler,
    asyncHandler,
};
