// services/itemCodeService.js
const ItemCode = require('../models/ItemCode');
const { CustomError } = require('../utils/error');
const { Sequelize, Op } = require('sequelize');

// Create item code
exports.createItemCode = async (productId, code, desc, currentDate) => {
    // Check for duplicates
    const duplicateItemCode = await ItemCode.findOne({
        where: { product_id: productId, product_code: code }
    });

    if (duplicateItemCode) {
        throw new CustomError(409, 'Item code already exists');
    }
    // Create the new item code
    const newItemCode = await ItemCode.create({ product_id: productId, product_code: code, product_des: desc, date: currentDate });
    // Return the newly created item code
    return newItemCode;
};

// Fetch item codes by item ID
exports.getItemCodesByItemId = async (itemId) => {
    return await ItemCode.findAll({ where: { product_id: itemId } });
};

exports.getItemCodeById = async (itemCodeId) => {
    return await ItemCode.findByPk(itemCodeId);
};

// Update item code by ID
exports.updateItemCode = async (itemCodeId, product_id, code, desc) => {
    // Check if the item code exists
    const existingItemCode = await ItemCode.findByPk(itemCodeId);
    if (!existingItemCode) {
        throw new CustomError(400, 'Item code not found');
    }

    // Check for duplicates
    const duplicateItemCode = await ItemCode.findOne({
        where: {
            product_id,
            product_code: code,
            id: { [Sequelize.Op.ne]: itemCodeId } // Exclude the current itemCodeId
        }
    });
    if (duplicateItemCode) {
        throw new CustomError(409, 'Item code already exists');
    }

    // Update the item code
    existingItemCode.product_code = code;
    existingItemCode.product_des = desc;

    // Save the changes
    await existingItemCode.save();

    // Return the updated item code
    return existingItemCode;
};

exports.deleteItemCodeById = async (itemCodeId) => {
    // Use Sequelize's destroy method to delete the item code by its ID
    return await ItemCode.destroy({ where: { id: itemCodeId } });
};