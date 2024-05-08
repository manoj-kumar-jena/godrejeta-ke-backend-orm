// services/operatorAssignmentService.js

const OperatorAssignment = require('../models/OperatorAssignment');
const { sequelize } = require('../models/OperatorAssignment');
const User = require('../models/User');
const { CustomError } = require('../utils/error');
const dateUtils = require('../utils/dateUtils');

exports.getAllAssignments = async () => {
    const query = `
        SELECT operator_assign.*, geopos_users.entryid, geopos_users.roleid, geopos_users.name, 
               item_masterr.item_description, section.section_name 
        FROM operator_assign
        LEFT JOIN item_masterr ON operator_assign.product_name = item_masterr.id
        LEFT JOIN section ON operator_assign.section = section.id
        LEFT JOIN geopos_users ON operator_assign.name_id = geopos_users.id
    `;
    const assignments = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return assignments;
};

exports.getAssignmentsByOperatorId = async (operatorId) => {
    // Check if operator exists
    const operator = await User.findOne({
        where: { id: operatorId }
    });

    // If operator does not exist, throw an error
    if (!operator) {
        throw new CustomError(401, 'Operator not found');
    }

    const query = `
            SELECT operator_assign.*, section.section_name, item_masterr.item_description
            FROM operator_assign
            LEFT JOIN section ON operator_assign.section = section.id
            LEFT JOIN item_masterr ON operator_assign.product_name = item_masterr.id
            WHERE operator_assign.name_id = :operatorId
        `;
    const assignments = await sequelize.query(query, {
        replacements: { operatorId: operatorId },
        type: sequelize.QueryTypes.SELECT
    });
    return assignments;
};

exports.addAssignment = async (assignmentData) => {
    try {
        const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");
        const existUserNames = [];
        const recordsToInsert = [];

        for (const product of assignmentData.products) {
            for (const section of assignmentData.sections) {
                const existingAssignment = await OperatorAssignment.findOne({
                    where: { product_name: product.value, section: section.value, site: assignmentData.site, shift: assignmentData.shift }
                });

                if (existingAssignment) {
                    const operator = await User.findByPk(existingAssignment.name_id);
                    if (operator) {
                        existUserNames.push(operator.name);
                    }
                } else {
                    recordsToInsert.push({ name_id: assignmentData.operatorId, product_name: product.value, section: section.value, site: assignmentData.site, shift: assignmentData.shift, date: currentDate });
                }
            }
        }

        if (recordsToInsert.length > 0 && existUserNames.length === 0) {
            await OperatorAssignment.bulkCreate(recordsToInsert);
            return { message: `${recordsToInsert.length} records inserted successfully` };
        } else if (recordsToInsert.length > 0 && existUserNames.length > 0) {
            await OperatorAssignment.bulkCreate(recordsToInsert);
            return { message: `${recordsToInsert.length} records inserted successfully and other records already exist for operators: ${existUserNames.join(', ')}` };
        } else {
            return { message: 'Records are already assigned to the same operator or other operators' };
        }
    } catch (error) {
        throw error;
    }
};

// {
//     "operatorId": "34",
//     "shift": "night",
//     "site": "NAKURU",
//     "products": [{ "value": 1, "label": "Product A" },{ "value": 2, "label": "Product B" }],
//     "sections": [{ "value": 3, "label": "Section A" },{ "value": 2, "label": "Section B" }]
// }

exports.updateAssignment = async (operatorId, assigmentIdsParam) => {
    // Parse the comma-separated string into an array of integers
    const assigmentIds = assigmentIdsParam.split(',').map(id => parseInt(id.trim(), 10));

    // Ensure assigmentIds array is not empty
    if (!assigmentIds || assigmentIds.length === 0 || assigmentIds.some(isNaN)) {
        throw new CustomError(401, 'Invalid assigmentIds');
    }

    // Update operator_assign table
    const result = await OperatorAssignment.update(
        { name_id: operatorId },
        { where: { id: assigmentIds } }
    );
    return { effectedRows: result };
};
// {
//     "operatorId": "34",
//     "assigmentIds": "1797,1796"
// }

exports.deleteAssignment = async (assigmentId) => {
    return await OperatorAssignment.destroy({ where: { id: assigmentId } });
};