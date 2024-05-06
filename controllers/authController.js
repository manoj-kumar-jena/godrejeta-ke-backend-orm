// controllers/authController.js
const authService = require('../services/authService');
const userService = require('../services/userService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

// Validate login credentials
exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !email.trim() || !password || !password.trim()) {
        throw new CustomError(400, 'Email and password are required');
    }
    next();
};

// Login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const token = await authService.authenticateUser(email, password);
        const user = await userService.getUserByEmail(email);
        // Create an instance of ApiResponse with status code 200
        const response = new ApiResponse(200, { user, token }, "Login successful");
        // Send the response as JSON
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
