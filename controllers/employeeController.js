// controllers/employeeController.js

const employeeService = require('../services/employeeService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.getEmployeesByIds = async (req, res, next) => {
    try {
        const ids = req.params.ids;
        if (!ids) {
            throw new CustomError(400, 'Employee IDs are required');
        }
        const employees = await employeeService.getEmployeesByIds(ids);
        res.status(200).json(new ApiResponse(200, employees));
    } catch (error) {
        next(error);
    }
};
exports.getEmployeesByRoleOperator = async (req, res, next) => {
    try {
        // Fetch roleId and userId from the req object
        const { roleId, userId } = req;

        let operators;
        // Check if roleId is 5 (assuming roleId 5 corresponds to a specific role)
        if (roleId === 5) {
            // Fetch all operators if roleId is 5
            operators = await employeeService.getEmployeesByRoleOperator();
        } else {
            // Fetch operators by userId if roleId is not 5
            operators = await employeeService.getEmployeesByRoleOperatorAndByuserId(userId);
        };


        res.status(200).json(new ApiResponse(200, operators));
    } catch (error) {
        next(error);
    }
};

exports.getEmployeesCountByRoleOperator = async (req, res, next) => {
    try {
        const operatorsCount = await employeeService.getEmployeesCountByRoleId(3);
        res.status(200).json(new ApiResponse(200, { totalOperators: operatorsCount }));
    } catch (error) {
        next(error);
    }
};

exports.addOperator = async (req, res, next) => {
    try {
        const { name, username, email, entryid, password, workertype, shift, site } = req.body;
        // Check if all required fields are provided
        if (!name || !username || !email || !entryid || !password || !workertype || !shift || !site) {
            throw new CustomError(400, 'All fields are required');
        }
        // Call service function to create operator
        const result = await employeeService.createOperator(req.body);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

exports.getOperatorById = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        if (!employeeId || !employeeId.trim() || isNaN(employeeId)) {
            throw new CustomError(400, 'Employee ID is required');
        }
        const employee = await employeeService.getOperatorById(employeeId);
        res.status(200).json(new ApiResponse(200, employee));
    } catch (error) {
        next(error);
    }
};

exports.updateOperator = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const { name, entryid, workertype, shift, site } = req.body;
        // Check if all required fields are provided
        if (!employeeId || !employeeId.trim() || isNaN(employeeId)) {
            throw new CustomError(400, 'Employee ID is required');
        }
        if (!name || !entryid || !workertype || !shift || !site) {
            throw new CustomError(400, 'All fields are required');
        }
        // Call service function to update operator
        const result = await employeeService.updateOperator(employeeId, req.body);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

exports.disableOperator = async (req, res, next) => {
    try {
        const entryId = req.params.entryId;
        // Check if all required fields are provided
        if (!entryId || !entryId.trim()) {
            throw new CustomError(400, 'Entry ID is required');
        }
        // Call service function to disable operator
        const result = await employeeService.disableOperator(entryId);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};
exports.enableOperator = async (req, res, next) => {
    try {
        const entryId = req.params.entryId;
        // Check if all required fields are provided
        if (!entryId || !entryId.trim()) {
            throw new CustomError(400, 'Entry ID is required');
        }
        // Call service function to enable operator
        const result = await employeeService.enableOperator(entryId);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

exports.updateOperatorsShift = async (req, res, next) => {
    try {
        const { shift, operatorIds } = req.body;
        // Check if all required fields are provided
        if (!shift || !shift.trim()) {
            throw new CustomError(400, 'Shift is required');
        }
        if (!operatorIds) {
            throw new CustomError(400, 'Operator IDs are required');
        }
        // Call service function to update operators shift
        const result = await employeeService.updateOperatorsShift(shift, operatorIds);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};
