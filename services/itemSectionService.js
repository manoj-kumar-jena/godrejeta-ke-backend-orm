// services/itemSectionService.js
const ItemSection = require('../models/ItemSection');
const { sequelize } = require('../models/ItemSection');
const { CustomError } = require('../utils/error');
const { Sequelize, Op } = require('sequelize');

exports.getItemSectionsByItemId = async (itemId) => {
    const query = `
        SELECT s.section_name, s.target_unit, ism.target, ism.n_target, ism.id, im.item_description
        FROM item_section_moz ism
        LEFT JOIN section s ON ism.section_id = s.id
        LEFT JOIN item_masterr im ON ism.item_id = im.id
        WHERE ism.item_id = :itemId
    `;
    // Execute the query using sequelize.query()
    const itemSections = await sequelize.query(query, {
        replacements: { itemId },
        type: sequelize.QueryTypes.SELECT
    });
    return itemSections;
};

exports.getItemSectionById = async (itemSectionId) => {
    const query = `
        SELECT s.section_name, s.target_unit, ism.target, ism.n_target, ism.item_id
        FROM item_section_moz ism
        INNER JOIN section s ON ism.section_id = s.id
        WHERE ism.id = ?
    `;
    const itemSection = await sequelize.query(query, {
        replacements: [itemSectionId],
        type: sequelize.QueryTypes.SELECT
    });
    // Check if itemSection is null
    if (itemSection.length === 0) {
        throw new CustomError(404, 'Item section not found');
    }
    return itemSection;
};

exports.updateItemSection = async (itemSectionId, itemSectionData) => {
    // Check if the item section exists
    const existingItemSection = await ItemSection.findByPk(itemSectionId);
    if (!existingItemSection) {
        throw new CustomError(404, 'item section not found');
    }

    // Check for duplicates
    const duplicateItemSection = await ItemSection.findOne({
        where: {
            target: itemSectionData.target,
            n_target: itemSectionData.n_target,
            item_id: existingItemSection.item_id,
            section_id: existingItemSection.section_id,
            id: { [Sequelize.Op.not]: itemSectionId } // Exclude the current item section
        }
    });

    if (duplicateItemSection) {
        throw new CustomError(409, 'Item section details already exists');
    }
    // Update the item section
    await ItemSection.update({ target: itemSectionData.target, n_target: itemSectionData.n_target }, { where: { id: itemSectionId } });
    return await this.getItemSectionById(itemSectionId);
};

exports.deleteItemSection = async (itemSectionId) => {
    return await ItemSection.destroy({ where: { id: itemSectionId } });
};

