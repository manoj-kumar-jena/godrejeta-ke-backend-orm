// utils/errors.js
class CustomError extends Error {
    constructor(statusCode, message, errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode || 500;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message || 'Not found', 404);
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message || 'Bad request', 400);
    }
}

module.exports = { CustomError, NotFoundError, BadRequestError };
