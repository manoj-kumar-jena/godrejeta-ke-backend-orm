// controllers/itemSectionController.js
const itemSectionService = require('../services/itemSectionService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');



exports.getItemSectionsByItemId = async (req, res, next) => {
    try {
        // Extract item ID from request parameters
        const itemId = req.params.itemId;

        // Validate input
        if (!itemId || itemId.trim() === '' || isNaN(itemId)) {
            throw new CustomError(400, 'Item ID is required');
        }
        // Call the service to fetch item sections
        const itemSections = await itemSectionService.getItemSectionsByItemId(itemId);
        // Return the item sections in the response
        res.status(200).json(new ApiResponse(200, itemSections));
    } catch (error) {
        next(error);
    }
};
exports.getItemSectionById = async (req, res, next) => {
    try {
        // Extract item section ID from request parameters
        const itemSectionId = req.params.id;

        // Validate input
        if (!itemSectionId || itemSectionId.trim() === '' || isNaN(itemSectionId)) {
            throw new CustomError(400, 'Item section ID is required');
        }

        // Call the service function to fetch the item section by ID
        const itemSection = await itemSectionService.getItemSectionById(itemSectionId);

        // Respond with the item section data
        res.status(200).json(new ApiResponse(200, itemSection));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

exports.updateItemSection = async (req, res, next) => {
    try {
        // Extract item section ID from request parameters
        const itemSectionId = req.params.id;
        const { target, n_target } = req.body;
        // Validate input
        if (!itemSectionId || itemSectionId.trim() === '' || isNaN(itemSectionId)) {
            throw new CustomError(400, 'Item section ID is required');
        }
        if (!target || !target.trim() || isNaN(target) || !n_target || !n_target.trim() || isNaN(n_target)) {
            throw new CustomError(400, 'Required fields are missing');
        }
        // Update the item section
        const updatedItemSection = await itemSectionService.updateItemSection(itemSectionId, req.body);
        res.status(200).json(new ApiResponse(200, updatedItemSection, "Item section updated successfully"));
    } catch (error) {
        next(error);
    }
};

exports.deleteItemSection = async (req, res, next) => {
    try {
        // Extract item section ID from request parameters
        const itemSectionId = req.params.id;

        // Validate input
        if (!itemSectionId || !itemSectionId.trim() || isNaN(itemSectionId)) {
            throw new CustomError(400, 'Item section ID is required');
        }
        const deletedItemSection = await itemSectionService.deleteItemSection(itemSectionId);
        if (!deletedItemSection) {
            throw new CustomError(400, 'Item section not found');
        }
        res.status(200).json(new ApiResponse(200, deletedItemSection, "Item section deleted successfully"));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};