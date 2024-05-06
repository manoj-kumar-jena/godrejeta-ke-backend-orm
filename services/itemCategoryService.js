// services/itemCategoryService.js
const ItemCategory = require('../models/ItemCategory');
const { CustomError } = require('../utils/error');

// Create a new item category
exports.createItemCategory = async (categoryName) => {
    // Check if the category already exists
    const existingCategory = await ItemCategory.findOne({ where: { category_name: categoryName } });
    if (existingCategory) {
        throw new CustomError(409, 'Category name already exists');
    }
    // Create the new item category
    const newItemCategory = await ItemCategory.create({ category_name: categoryName });

    return newItemCategory;
};

// Get all item categories
exports.getAllItemCategories = async () => {
    return await ItemCategory.findAll();
};
