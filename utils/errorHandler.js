// utils/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    const statusCode = err.statusCode || 500;
    const success = err.success || false;
    res.status(statusCode).json({
        error: {
            statusCode: statusCode,
            message: err.message,
            success: success
        }
    });
}

module.exports = errorHandler;