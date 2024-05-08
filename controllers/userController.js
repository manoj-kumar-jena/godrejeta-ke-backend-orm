// controllers/userController.js
const userService = require('../services/userService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(new ApiResponse(200, users));
    } catch (error) {
        next(error);
    }
};

exports.getUserByIdOrEntryId = async (req, res, next) => {
    try {
        // Extract user ID from request parameters
        const userIdOrEntryId = req.params.id;
        // Validate input
        if (!userIdOrEntryId || !userIdOrEntryId.trim()) {
            throw new CustomError(400, 'User ID or EntryId is required');
        }
        let user = await userService.getUserById(userIdOrEntryId);
        if (!user) {
            user = await userService.getUserByIdOrEntryId(userIdOrEntryId);
        }
        if (!user) {
            throw new CustomError(400, 'User not found');
        }
        res.status(200).json(new ApiResponse(200, user));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.getUsersByRoleId = async (req, res, next) => {
    try {
        // Extract role ID from request parameters
        const roleId = req.params.roleId;
        // Validate input
        if (!roleId || !roleId.trim() || isNaN(roleId)) {
            throw new CustomError(400, 'Role ID is required');
        }
        let users = await userService.getUsersByRoleId(roleId);
        res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.updateUserPassword = async (req, res, next) => {
    try {
        const { userId, confirmPassword } = req.body;

        // Validate input
        if (!userId || !userId.trim() || isNaN(userId)) {
            throw new CustomError(400, 'User ID is required');
        }
        if (!confirmPassword || !confirmPassword.trim()) {
            throw new CustomError(400, 'Password is required');
        }
        // Update the user
        const result = await userService.updateUserPassword(userId, confirmPassword);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.updateUserLanguage = async (req, res, next) => {
    try {
        const { userId, language } = req.body;

        // Validate input
        if (!userId || !userId.trim() || isNaN(userId)) {
            throw new CustomError(400, 'User ID is required');
        }
        if (!language || !language.trim()) {
            throw new CustomError(400, 'Language is required');
        }
        // Update the user
        const result = await userService.updateUserLanguage(userId, language);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
