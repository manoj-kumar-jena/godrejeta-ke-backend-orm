// controllers/workerTypeController.js
const workerTypeService = require('../services/workerTypeService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.createWorkerType = async (req, res, next) => {
    try {
        const { workertype_name } = req.body;
        // Validate input
        if (!workertype_name || !workertype_name.trim()) {
            throw new CustomError(400, 'WorkerType name is required');
        }
        const newWorkerType = await workerTypeService.createWorkerType(workertype_name);
        res.status(201).json(new ApiResponse(200, newWorkerType, "WorkerType created successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getAllWorkerTypes = async (req, res, next) => {
    try {
        const workerTypes = await workerTypeService.getAllWorkerTypes();
        res.status(200).json(new ApiResponse(200, workerTypes));
    } catch (error) {
        next(error);
    }
};
