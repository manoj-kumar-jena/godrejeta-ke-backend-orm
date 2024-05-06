// controllers/itemCodeController.js
const itemCodeService = require('../services/itemCodeService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');
const dateUtils = require('../utils/dateUtils');

exports.createItemCode = async (req, res, next) => {
    try {
        const { code, desc } = req.body;
        const itemId = req.params.itemId;
        // Validate input
        if (!itemId || itemId.trim() === '' || isNaN(itemId)) {
            throw new CustomError(400, 'Item id is required');
        }
        if (!code || code.trim() === '') {
            throw new CustomError(400, 'Product code is required');
        }
        if (!desc || desc.trim() === '') {
            throw new CustomError(400, 'Product description is required');
        }
        const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");
        // Proceed with item code creation
        const newItemCode = await itemCodeService.createItemCode(itemId, code, desc, currentDate);
        res.status(201).json(new ApiResponse(201, newItemCode, "Item code created successfully"));
    } catch (error) {
        next(error);
    }
};

exports.getItemCodesByItemId = async (req, res, next) => {
    try {
        // Extract item ID from request parameters
        const itemId = req.params.itemId;

        // Validate input
        if (!itemId || itemId.trim() === '' || isNaN(itemId)) {
            throw new CustomError(400, 'Item ID is required');
        }
        // Call the service to fetch item codes
        const itemCodes = await itemCodeService.getItemCodesByItemId(itemId);
        // Return the item codes in the response
        res.status(200).json(new ApiResponse(200, itemCodes));
    } catch (error) {
        next(error);
    }
};

exports.getItemCodeById = async (req, res, next) => {
    try {
        // Extract ItemCode ID from request parameters
        const itemCodeId = req.params.id;

        // Validate input
        if (!itemCodeId || itemCodeId.trim() === '' || isNaN(itemCodeId)) {
            throw new CustomError(400, 'ItemCode ID is required');
        }

        // Call the service function to get the item code by ID
        const itemCode = await itemCodeService.getItemCodeById(itemCodeId);

        if (!itemCode) {
            throw new CustomError(404, 'Item code not found');
        }

        // Respond with the item code
        res.status(200).json(new ApiResponse(200, itemCode, 'Item code retrieved successfully'));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Update item code by ID
exports.updateItemCode = async (req, res, next) => {
    try {
        const itemCodeId = req.params.id;
        const { product_id, code, desc } = req.body;
        // Validate input
        if (!itemCodeId || itemCodeId.trim() === '' || isNaN(itemCodeId)) {
            throw new CustomError(400, 'ItemCode ID is required');
        }

        if (!product_id || product_id.trim() === '' || isNaN(product_id)) {
            throw new CustomError(400, 'Product id is required');
        }
        if (!code || code.trim() === '') {
            throw new CustomError(400, 'Product code is required');
        }
        if (!desc || desc.trim() === '') {
            throw new CustomError(400, 'Product description is required');
        }
        // Update item code
        const updatedItemCode = await itemCodeService.updateItemCode(itemCodeId, product_id, code, desc);
        res.status(200).json(new ApiResponse(200, updatedItemCode, 'Item code updated successfully'));
    } catch (error) {
        next(error);
    }
};

exports.deleteItemCode = async (req, res, next) => {
    try {
        const itemCodeId = req.params.id;

        // Validate input
        if (!itemCodeId || itemCodeId.trim() === '' || isNaN(itemCodeId)) {
            throw new CustomError(400, 'ItemCode ID is required');
        }

        // Call the service function to delete the item code by ID
        const deletedItemCode = await itemCodeService.deleteItemCodeById(itemCodeId);

        if (!deletedItemCode) {
            throw new CustomError(404, 'Item code not found');
        }

        // Respond with a success message
        res.status(200).json(new ApiResponse(200, 'Item code deleted successfully'));
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
