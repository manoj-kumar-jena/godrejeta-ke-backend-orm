// controllers/employeeTypeController.js
const employeeTypeService = require('../services/employeeTypeService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.getAllEmployeeTypes = async (req, res, next) => {
    try {
        const allEmployeeTypes = await employeeTypeService.getAllEmployeeTypes();
        res.status(200).json(new ApiResponse(200, allEmployeeTypes));
    } catch (error) {
        next(error);
    }
};

exports.getEmployeeTypeById = async (req, res, next) => {
    try {
        // Extract EmployeeType ID from request parameters
        const { id } = req.params;

        // Validate input
        if (!id || !id.trim() || isNaN(id)) {
            throw new CustomError(400, 'EmployeeType ID is required');
        }

        const employeeType = await employeeTypeService.getEmployeeTypeById(id);

        if (!employeeType) {
            throw new CustomError(400, 'EmployeeType not found');
        }
        res.status(200).json(new ApiResponse(200, employeeType));
    } catch (error) {
        next(error);
    }
};




