const shiftService = require('../services/shiftService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.createShift = async (req, res, next) => {
    try {
        const { shift_name } = req.body;
        // Validate input
        if (!shift_name || !shift_name.trim() || isNaN(shift_name)) {
            throw new CustomError(400, 'Shift Name is required');
        }
        // Proceed with shift creation
        const newShift = await shiftService.createShift(shift_name);
        res.status(201).json(new ApiResponse(201, newShift, "Shift created successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getAllShifts = async (req, res, next) => {
    try {
        // Fetch roleId and userId from the req object
        const { roleId, userId } = req;

        let shifts;
        // Check if roleId is 5 (assuming roleId 5 corresponds to a specific role)
        if (roleId === 5) {
            // Fetch all shifts if roleId is 5
            shifts = await shiftService.getAllShifts();
        } else {
            // Fetch shifts by userId if roleId is not 5
            shifts = await shiftService.getShiftsByUserId(userId);
        };
        res.status(200).json(new ApiResponse(200, shifts));
    } catch (error) {
        next(error);
    }
};

exports.getShiftById = async (req, res, next) => {
    try {
        // Extract shift ID from request parameters
        const shiftId = req.params.id;

        // Validate input
        if (!shiftId || !shiftId.trim() || isNaN(shiftId)) {
            throw new CustomError(400, 'Shift ID is required');
        }
        const shift = await shiftService.getShiftById(shiftId);
        if (!shift) {
            throw new CustomError(400, 'Shift not found');
        }
        res.status(200).json(new ApiResponse(200, shift));
    } catch (error) {
        next(error);
    }
};
