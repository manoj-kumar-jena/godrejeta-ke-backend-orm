const GeoposShift = require('../models/GeoposShift');
const { Sequelize, Op } = require('sequelize');
const { CustomError } = require('../utils/error');

exports.createShift = async (shiftName) => {
    // Check if the shift already exists
    const existingShift = await GeoposShift.findOne({
        where: {
            [Op.or]: [
                { name: shiftName },
                { nhrs: shiftName }
            ]
        }
    });
    if (existingShift) {
        throw new CustomError(409, 'Shift name already exists');
    }

    return await GeoposShift.create({
        name: `${shiftName}HRS`,
        nhrs: shiftName
    });
};

exports.getAllShifts = async () => {
    return await GeoposShift.findAll();
};

exports.getShiftById = async (shiftId) => {
    return await GeoposShift.findByPk(shiftId);
};

exports.getShiftByName = async (shiftName) => {
    return await GeoposShift.findOne({
        where: {
            [Op.or]: [
                { name: shiftName },
                { nhrs: shiftName }
            ]
        }
    });
};

//fetch shifts associated with the given userId
exports.getShiftsByUserId = async (userId) => {
    const shifts = await GeoposShift.findAll({
        where: {
            name: {
                [Op.in]: Sequelize.literal(`(SELECT shift FROM employees_moz WHERE entryid=( SELECT entryid FROM geopos_users WHERE id=${userId} ))`)
            }
        }
    });
    return shifts;
};

