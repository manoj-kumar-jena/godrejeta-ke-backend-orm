// controllers/operatorAssignmentController.js

const operatorAssignmentService = require('../services/operatorAssignmentService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.getAllAssignments = async (req, res, next) => {
    try {
        const assignments = await operatorAssignmentService.getAllAssignments();
        res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getAssignmentsByOperatorId = async (req, res, next) => {
    try {
        const operatorId = req.params.operatorId;
        if (!operatorId || !operatorId.trim() || isNaN(operatorId)) {
            throw new CustomError(400, 'Operator ID is required');
        }
        const assignments = await operatorAssignmentService.getAssignmentsByOperatorId(operatorId);
        res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched successfully"));
    } catch (error) {
        next(error);
    }
};

exports.addAssignment = async (req, res, next) => {
    try {
        const { operatorId, shift, site, products, sections } = req.body;
        // Check if all required fields are provided
        if (!operatorId || !operatorId.trim() || isNaN(operatorId)) {
            throw new CustomError(400, 'Operator ID is required');
        }
        if (!shift || !site || !products || !sections) {
            throw new CustomError(400, 'Required fields are missing');
        }
        // Call service function to create assignment
        const result = await operatorAssignmentService.addAssignment(req.body);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

exports.updateAssignment = async (req, res, next) => {
    try {
        const { operatorId, assigmentIds } = req.body;
        // Check if all required fields are provided
        if (!operatorId || !operatorId.trim() || isNaN(operatorId)) {
            throw new CustomError(400, 'Operator ID is required');
        }
        if (!assigmentIds) {
            throw new CustomError(400, 'Assigment IDs are required');
        }
        // Call service function to create assignment
        const result = await operatorAssignmentService.updateAssignment(operatorId, assigmentIds);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

exports.deleteAssignment = async (req, res, next) => {
    try {
        // Extract assigment ID from request parameters
        const assigmentId = req.params.id;
        // Validate input
        if (!assigmentId || !assigmentId.trim() || isNaN(assigmentId)) {
            throw new CustomError(400, 'Assigment ID is required');
        }
        const deletedAssigment = await operatorAssignmentService.deleteAssignment(assigmentId);
        if (!deletedAssigment) {
            throw new CustomError(400, 'Assigment not found');
        }
        res.status(200).json(new ApiResponse(200, deletedAssigment, "Assigment deleted successfully"));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
