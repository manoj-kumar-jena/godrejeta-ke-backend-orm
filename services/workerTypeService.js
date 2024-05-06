// services/workerTypeService.js
const WorkerType = require('../models/WorkerType');
const { CustomError } = require('../utils/error');

exports.createWorkerType = async (name) => {
    // Check if the worker type already exists
    const existingWorkerType = await WorkerType.findOne({ where: { name } });
    if (existingWorkerType) {
        throw new CustomError(409, 'Worker type already exists');
    }
    return await WorkerType.create({ name });
};

exports.getAllWorkerTypes = async () => {
    return await WorkerType.findAll();
};
