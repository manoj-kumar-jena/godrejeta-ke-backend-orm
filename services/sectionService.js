// services/sectionService.js
const Section = require('../models/Section');
const { Sequelize, Op } = require('sequelize');
const { CustomError } = require('../utils/error');

exports.createSection = async (sectionName) => {
    // Check if the section already exists
    const existingSection = await Section.findOne({ where: { section_name: sectionName } });
    if (existingSection) {
        throw new CustomError(409, 'Section name already exists');
    }
    // Create the new section
    const newSection = await Section.create({ section_name: sectionName });
    return newSection;
};

exports.getAllSections = async () => {
    return await Section.findAll();
};

exports.getSectionById = async (sectionId) => {
    return await Section.findByPk(sectionId);
};

exports.updateSection = async (sectionId, sectionName) => {
    // Check if the section exists
    const existingSection = await Section.findByPk(sectionId);
    if (!existingSection) {
        throw new CustomError(404, 'Section not found');
    }

    // Check for duplicates
    const duplicateSection = await Section.findOne({
        where: {
            section_name: sectionName,
            id: { [Sequelize.Op.ne]: sectionId } // Exclude the current itemCodeId
        }
    });

    if (duplicateSection) {
        throw new CustomError(409, 'Section name already exists');
    }
    // Update the section
    await Section.update({ section_name: sectionName }, { where: { id: sectionId } });
    return await this.getSectionById(sectionId);
};

exports.deleteSection = async (sectionId) => {
    return await Section.destroy({ where: { id: sectionId } });
};

// Get total count of sections
exports.getTotalSectionCount = async () => {
    return await Section.count();
};

//fetch sections associated with the given userId
exports.getSectionsByUserId = async (userId) => {
    const sections = await Section.findAll({
        where: {
            id: {
                [Op.in]: Sequelize.literal(`(SELECT section FROM operator_assign WHERE name_id = ${userId} GROUP BY section)`)
            }
        }
    });
    return sections;
};
