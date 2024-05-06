// controllers/itemCategoryController.js
const itemCategoryService = require('../services/itemCategoryService');
const { CustomError } = require('../utils/error');
const { ApiResponse } = require('../utils/ApiResponse');
// Create a new item category
exports.createItemCategory = async (req, res, next) => {
    try {
        const { category_name } = req.body;
        // Validate input
        if (!category_name || !category_name.trim()) {
            throw new CustomError(400, 'Category name is required');
            //return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const newItemCategory = await itemCategoryService.createItemCategory(category_name);
        res.status(200).json(new ApiResponse(200, newItemCategory, "Item category created successfully"));
    } catch (error) {
        next(error);
    }
};

// Get all item categories
exports.getAllItemCategories = async (req, res, next) => {
    try {
        const allItemCategories = await itemCategoryService.getAllItemCategories();
        res.status(200).json(new ApiResponse(200, allItemCategories));
    } catch (error) {
        next(error);
    }
};
