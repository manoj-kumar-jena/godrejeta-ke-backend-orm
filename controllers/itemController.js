// controllers/itemController.js
const itemService = require('../services/itemService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');
const dateUtils = require('../utils/dateUtils');
const ExcelJS = require('exceljs');

exports.getAllItems = async (req, res, next) => {
    try {
        // Fetch roleId and userId from the req object
        const { roleId, userId } = req;

        let items;
        // Check if roleId is 5 (assuming roleId 5 corresponds to a specific role)
        if (roleId === 5) {
            // Fetch all items if roleId is 5
            items = await itemService.getAllItems();
        } else {
            // Fetch items by userId if roleId is not 5
            items = await itemService.getItemsByUserId(userId);
        };
        res.status(200).json(new ApiResponse(200, items));
    } catch (error) {
        next(error);
    }
};

exports.getTotalItemCount = async (req, res, next) => {
    try {
        // Get total count of items from the service
        const totalCount = await itemService.getTotalItemCount();

        // Prepare response object
        const response = new ApiResponse(200, { totalItem: totalCount }, "Total item count retrieved successfully");

        // Send response
        res.status(200).json(response);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};



exports.addItem = async (req, res, next) => {
    try {
        const { category_id, item_description, item_group, sections } = req.body;
        // Validate input
        if (!category_id || !category_id.trim() || isNaN(category_id) || !item_description || !item_description.trim() || !item_group || !item_group.trim()) {
            throw new CustomError(400, 'Required fields are missing');
        }
        // Validate sections
        if (!sections || !Array.isArray(sections) || sections.length === 0) {
            throw new CustomError(400, 'At least one section must be included');
        }
        // Call the service to add item
        const newItem = await itemService.addItem(category_id, item_description, item_group, sections);
        res.status(201).json(new ApiResponse(201, newItem, "Item created successfully"));
    } catch (error) {
        next(error);
    }
};


exports.getItemById = async (req, res, next) => {
    try {
        // Extract item ID from request parameters
        const itemId = req.params.id;

        // Validate input
        if (!itemId || !itemId.trim() || isNaN(itemId)) {
            throw new CustomError(400, 'Item ID is required');
        }
        const item = await itemService.getItemById(itemId);
        if (!item) {
            throw new CustomError(400, 'Item not found');
        }
        res.status(200).json(new ApiResponse(200, item));
    } catch (error) {
        next(error);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        // Extract item ID from request parameters
        const itemId = req.params.id;
        const { category_id, item_group, item_description } = req.body;
        // Validate input
        if (!category_id || !category_id.trim() || isNaN(category_id) || !item_description || !item_description.trim() || !item_group || !item_group.trim()) {
            throw new CustomError(400, 'Required fields are missing');
        }
        // Update the item
        const updatedItem = await itemService.updateItem(itemId, req.body);
        res.status(200).json(new ApiResponse(200, updatedItem, "Item updated successfully"));
    } catch (error) {
        next(error);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        // Extract item ID from request parameters
        const itemId = req.params.id;

        // Validate input
        if (!itemId || !itemId.trim() || isNaN(itemId)) {
            throw new CustomError(400, 'Item ID is required');
        }
        const result = await itemService.deleteItem(itemId);
        res.status(200).json(new ApiResponse(200, result, "Item deleted successfully"));
    } catch (error) {
        next(error);
    }
};


exports.exportToExcel = async (req, res, next) => {
    try {
        const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");

        const items = await itemService.getAllItems();

        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Items');

        // Add headers to the worksheet
        worksheet.columns = [
            { header: 'Item Description', key: 'item_description', width: 40 },
            { header: 'Item Group', key: 'item_group', width: 20 },
            { header: 'Plan', key: 'plan', width: 20 },
            { header: 'Date', key: 'date', width: 20 }
        ];

        // Add data rows to the worksheet
        items.forEach(item => {
            worksheet.addRow({ item_description: item.item_description, item_group: item.item_group, plan: 0, date: currentDate });
        });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="ItemTargetPlans.xlsx"');

        // Pipe the workbook to the response
        await workbook.xlsx.write(res);

        // End the response
        res.end();
    } catch (error) {
        next(error);
    }
};