// services/itemService.js
const Item = require('../models/Item');
const ItemSection = require('../models/ItemSection');
const ItemCode = require('../models/ItemCode');
const { sequelize } = require('../models/Item');
const { Sequelize, Op } = require('sequelize');
const { CustomError } = require('../utils/error');

exports.getAllItems = async () => {
    // Execute the SQL query to fetch all items with their category and subcategory details
    const query = `
            SELECT item_masterr.*, item_category.category_name, item_subcategory.subcategory_name
            FROM item_masterr
            LEFT JOIN item_category ON item_masterr.category_id = item_category.id
            LEFT JOIN item_subcategory ON item_masterr.subcategory_id = item_subcategory.id
        `;
    // Execute the query using sequelize.query()
    const items = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return items;
};

// Get total count of items
exports.getTotalItemCount = async () => {
    return await Item.count();
};

exports.getItemsByUserId = async (userId) => {
    const query = `
            SELECT * FROM item_masterr
            WHERE id IN (
                SELECT product_name FROM operator_assign
                WHERE name_id = ${userId}
                GROUP BY product_name
            )
        `;
    // Execute the query using sequelize.query()
    const items = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    // Return the items
    return items;
};

exports.addItem = async (categoryId, itemDescription, itemGroup, sections) => {
    // Check for item duplicacy
    const existingItem = await Item.findOne({
        where: { category_id: categoryId, item_description: itemDescription, item_group: itemGroup }
    });
    if (existingItem) {
        throw new CustomError(409, 'Item already exists');
    }
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create the item
        const newItem = await Item.create({ category_id: categoryId, item_description: itemDescription, item_group: itemGroup }, { transaction });

        // Insert associated section target data
        const promises = sections.map(section => {
            return ItemSection.create({
                item_id: newItem.id,
                section_id: section.sectionId,
                target: section.target,
                n_target: section.nTarget
            }, { transaction });
        });
        // Commit the transaction
        await Promise.all(promises);
        await transaction.commit();

        return newItem;
    } catch (error) {
        // Rollback transaction if any error occurs
        await transaction.rollback();
        throw error;
    }
};

exports.getItemById = async (itemId) => {
    return await Item.findByPk(itemId);
};



exports.updateItem = async (itemId, itemData) => {
    // Check if the item exists
    const existingItem = await Item.findByPk(itemId);
    if (!existingItem) {
        throw new CustomError(404, 'Item not found');
    }

    // Check for duplicate item
    const duplicateItem = await Item.findOne({
        where: {
            item_description: itemData.item_description,
            category_id: itemData.category_id,
            item_group: itemData.item_group,
            id: { [Sequelize.Op.not]: itemId }
        }
    });
    if (duplicateItem) {
        throw new CustomError(409, 'Item already exists');
    }
    // Update item
    const updatedItem = await Item.update(
        {
            item_description: itemData.item_description,
            category_id: itemData.category_id,
            item_group: itemData.item_group
        },
        { where: { id: itemId } }
    );
    return updatedItem;
};

exports.deleteItem = async (itemId) => {
    let transaction;
    try {
        // Check if the item exists
        const existingItem = await Item.findByPk(itemId);
        if (!existingItem) {
            throw new CustomError(404, 'Item not found');
        }
        // Start a transaction
        transaction = await sequelize.transaction();

        // Delete item
        await Item.destroy({ where: { id: itemId }, transaction });

        // Delete related item sections
        await ItemSection.destroy({ where: { item_id: itemId }, transaction });

        // Delete related item codes
        await ItemCode.destroy({ where: { product_id: itemId }, transaction });

        // Commit the transaction if all delete operations succeed
        await transaction.commit();

        // Return any relevant data to indicate success
        return { deleted: true };

    } catch (error) {
        // Rollback the transaction if any delete operation fails
        if (transaction) await transaction.rollback();
        throw error;
    }
};