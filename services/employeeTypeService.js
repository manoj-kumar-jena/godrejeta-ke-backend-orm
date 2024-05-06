// services/employeeTypeService.js
const EmployeeType = require('../models/EmployeeType');

exports.getAllEmployeeTypes = async () => {
    return await EmployeeType.findAll();
};

exports.getEmployeeTypeById = async (typeId) => {
    return await EmployeeType.findByPk(typeId);
};

