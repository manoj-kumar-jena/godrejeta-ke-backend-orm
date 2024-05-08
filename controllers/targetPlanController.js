// controllers/targetPlanController.js
const targetPlanService = require('../services/targetPlanService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');

exports.insertOrUpdate = async (req, res, next) => {
    try {
        const records = req.body;
        //validate iput
        if (!Array.isArray(records)) {
            throw new CustomError(400, 'Invalid request format. Expecting an array of records.');
        }
        if (records.length === 0) {
            throw new CustomError(400, 'Invalid request format. Array of records cannot be empty.');
        }
        const newTargetPlans = await targetPlanService.insertOrUpdate(records);
        res.status(201).json(new ApiResponse(201, newTargetPlans, "Target plans created / updated successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getTargetPlansByDatetime = async (req, res, next) => {
    try {
        const { datetime } = req.query;

        // Check if datetime parameter is provided
        if (!datetime) {
            throw new CustomError(400, 'Datetime parameter is required.');
        }

        const targetPlans = await targetPlanService.getTargetPlansByDatetime(datetime);

        res.status(200).json(new ApiResponse(200, { datetime: datetime, targetPlans }, "Target plans fetched successfully"));
    } catch (error) {
        next(error);
    }
};

exports.deleteTargetPlan = async (req, res, next) => {
    try {
        const targetPlanId = req.params.id;

        // Check if targetPlanId parameter is provided
        if (!targetPlanId || !targetPlanId.trim() || isNaN(targetPlanId)) {
            throw new CustomError(400, 'TargetPlan ID parameter is required.');
        }

        const deletedRows = await targetPlanService.deleteTargetPlan(targetPlanId);
        res.status(200).json(new ApiResponse(200, deletedRows, "TargetPlan deleted successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getTargetPlansForThisMonth = async (req, res, next) => {
    try {
        const processedResult = await targetPlanService.getTargetPlansForThisMonth();
        // Send the response with the processed result
        res.status(200).json(new ApiResponse(200, processedResult, "Target plans for this month fetched successfully"));
    } catch (error) {
        next(error);
    }
};

exports.importFromExcel = async (req, res, next) => {
    try {
        //console.log(req.file);
        if (!req.file) {
            throw new CustomError(400, 'No file uploaded');
        }

        const filePath = req.file.path; // Path to the uploaded file

        // Call the service to import data from Excel and insert records
        const result = await targetPlanService.importFromExcel(filePath, next);
        res.status(200).json(new ApiResponse(200, result, "Data imported successfully"));
    } catch (error) {
        next(error);
    }
};


