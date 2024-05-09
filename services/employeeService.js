// services/employeeService.js

const Employee = require('../models/Employee');
const User = require('../models/User');
const OperatorAssignment = require('../models/OperatorAssignment');
const EmployeeType = require('../models/EmployeeType');
const { sequelize } = require('../models/Employee');
const { Sequelize, Op } = require('sequelize');
const { CustomError } = require('../utils/error');
const dateUtils = require('../utils/dateUtils');
const { hashPassword } = require('../utils/passwordUtils'); // Import the hashPassword utility function

exports.getEmployeesByIds = async (entryIdsParam) => {
    // Parse the comma-separated string into an array of integers
    const entryIds = entryIdsParam.split(',').map(id => parseInt(id.trim(), 10));

    // Ensure entryIds array is not empty
    if (!entryIds || entryIds.length === 0 || entryIds.some(isNaN)) {
        throw new CustomError(401, 'Invalid entryIds');
    }

    const query = `SELECT entryid, name FROM employees_moz WHERE id IN (:entryIds)`;
    const employees = await sequelize.query(query, {
        replacements: { entryIds: entryIds },
        type: sequelize.QueryTypes.SELECT
    });
    return employees;
};

exports.getEmployeesByRoleOperator = async () => {
    const roleId = 3;
    const query = `
            SELECT employees_moz.*, geopos_emptype.name AS role
            FROM employees_moz
            LEFT JOIN geopos_emptype ON employees_moz.roleid = geopos_emptype.id
            WHERE employees_moz.roleid = ?
        `;
    const employees = await sequelize.query(query, {
        replacements: [roleId],
        type: sequelize.QueryTypes.SELECT
    });
    return employees;
};

exports.getEmployeesByRoleOperatorAndByuserId = async (userId) => {
    const roleId = 3;
    const query = `
            SELECT employees_moz.*, geopos_users.banned, geopos_users.roleid, geopos_users.email, geopos_users.loc, geopos_emptype.name as emptype
      FROM employees_moz
      LEFT JOIN geopos_users ON employees_moz.entryid = geopos_users.entryid
      LEFT JOIN geopos_emptype ON geopos_users.roleid = geopos_emptype.id
      WHERE geopos_users.roleid = ? AND geopos_users.id = ?
        `;
    const employees = await sequelize.query(query, {
        replacements: [roleId, userId],
        type: sequelize.QueryTypes.SELECT
    });
    return employees;
};

exports.getOperatorById = async (employeeId) => {
    const query = `
            SELECT employees_moz.*,geopos_users.email
  FROM employees_moz
  LEFT JOIN geopos_users ON employees_moz.entryid = geopos_users.entryid
  WHERE employees_moz.id = ?
        `;
    const employee = await sequelize.query(query, {
        replacements: [employeeId],
        type: sequelize.QueryTypes.SELECT
    });
    return employee;
};

exports.getEmployeesCountByRoleId = async (roleId) => {
    // Check if roleId exists in EmployeeType table
    const role = await EmployeeType.findOne({
        where: { id: roleId }
    });
    // If roleId does not exist, throw an error
    if (!role) {
        throw new CustomError(401, 'Role ID not found');
    }
    return await Employee.count({ where: { roleid: roleId } });
};

exports.createOperator = async (operatorData) => {
    const roleId = 3;
    const currentDateTime = dateUtils.getCurrentDate("YYYY-MM-DD HH:mm:ss");
    const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");
    // Check if entryid already exists in geopos_users table
    const existingEntryId = await User.findOne({ where: { entryid: operatorData.entryid } });
    if (existingEntryId) {
        throw new CustomError(401, 'Entry Id already exists');
    }
    // Check if entryid already exists in employees_moz table
    const existingEntryId2 = await Employee.findOne({ where: { entryid: operatorData.entryid } });
    if (existingEntryId2) {
        throw new CustomError(401, 'Entry Id already exists');
    }

    // Check if email or username already exists in geopos_users table
    const existingUser = await User.findOne({ where: { [Sequelize.Op.or]: [{ email: operatorData.email }, { username: operatorData.username }] } });
    if (existingUser) {
        throw new CustomError(401, 'Email or username already exists');
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Create user in geopos_users table
        const newUser = await User.create({
            name: operatorData.name,
            username: operatorData.username,
            email: operatorData.email,
            roleid: roleId,
            entryid: operatorData.entryid,
            date_created: currentDateTime
        }, { transaction });

        // Create employee in employees_moz table
        await Employee.create({
            username: operatorData.username,
            entryid: operatorData.entryid,
            email: operatorData.email,
            name: operatorData.name,
            roleid: roleId,
            workertype: operatorData.workertype,
            shift: operatorData.shift,
            site: operatorData.site,
            date: currentDate
        }, { transaction });

        // Use the hashPassword utility function
        const hashedPassword = await hashPassword(operatorData.password, newUser.id);
        // Update password in geopos_users table
        await User.update({ pass: hashedPassword }, { where: { entryid: newUser.entryid }, transaction });

        // Commit transaction
        await transaction.commit();

        return { message: 'Record inserted successfully' };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw error;
    }
};

exports.updateOperator = async (employeeId, operatorData) => {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if the employee exists
        const existingEmployee = await Employee.findByPk(employeeId);
        if (!existingEmployee) {
            throw new CustomError(404, 'Employee not found');
        }
        // Check if the user exists
        const existingUser = await User.findOne({ where: { entryid: operatorData.entryid } });
        if (!existingUser) {
            throw new CustomError(404, 'User not found');
        }
        // Update employee in employees_moz table
        const updatedEmployee = await Employee.update({
            entryid: operatorData.entryid,
            name: operatorData.name,
            workertype: operatorData.workertype,
            shift: operatorData.shift,
            site: operatorData.site
        }, { where: { id: employeeId }, transaction });

        // Update user in geopos_users table
        const updatedUser = await User.update({
            name: operatorData.name
        }, { where: { entryid: operatorData.entryid }, transaction });

        // Commit transaction
        await transaction.commit();

        return { message: 'Record updated successfully' };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw error;
    }
};

exports.disableOperator = async (entryId) => {
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Check if the user exists
        const existingUser = await User.findOne({ where: { entryid: entryId } });
        if (!existingUser) {
            throw new CustomError(404, 'User not found');
        }

        // Update user in geopos_users table
        const updatedUser = await User.update({
            banned: 1,
            verification_code: null
        }, { where: { entryid: entryId }, transaction });

        // Delete records from operator_assign table
        const result = await OperatorAssignment.destroy({ where: { name_id: existingUser.id }, transaction });

        // Commit transaction
        await transaction.commit();

        return { message: 'Record updated successfully' };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw error;
    }
};

exports.enableOperator = async (entryId) => {
    // Check if the user exists
    const existingUser = await User.findOne({ where: { entryid: entryId } });
    if (!existingUser) {
        throw new CustomError(404, 'User not found');
    }
    // Update user in geopos_users table
    const updatedUser = await User.update({
        banned: 0
    }, { where: { entryid: entryId } });

    return { message: 'Record updated successfully' };
};

exports.updateOperatorsShift = async (shift, operatorIdsParam) => {
    // Parse the comma-separated string into an array of integers
    const operatorIds = operatorIdsParam.split(',').map(id => parseInt(id.trim(), 10));

    // Ensure operatorIds array is not empty
    if (!operatorIds || operatorIds.length === 0 || operatorIds.some(isNaN)) {
        throw new CustomError(401, 'Invalid operatorIds');
    }
    const result = await Employee.update(
        { shift: shift },
        { where: { id: operatorIds } }
    );
    return { effectedRows: result };
};

exports.createWorker = async (workerData) => {
    console.log(workerData);
    const roleId = 1;
    const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");
    // Check if entryid already exists in employees_moz table
    const existingEntryId = await Employee.findOne({ where: { entryid: workerData.entryId } });
    if (existingEntryId) {
        throw new CustomError(401, 'Entry Id already exists');
    }
    // Create employee in employees_moz table
    const newWorker = await Employee.create({
        entryid: workerData.entryId,
        name: workerData.name,
        workertype: workerData.workerType,
        shift: workerData.shift,
        site: workerData.site,
        joindate: workerData.joiningDate,
        type: workerData.type,
        roleid: roleId,
        product: workerData.productIds,
        section_id: workerData.sectionIds,
        date: currentDate
    });
    return newWorker;
};

exports.getEmployeesByRoleWorker = async (queryParams) => {
    const { productIds, sectionIds, site, shift } = queryParams;
    const roleId = 1;
    let whereConditions = [];
    whereConditions.push(`employees_moz.roleid = ${roleId}`);

    if (productIds !== '' && productIds !== undefined && productIds != null) {
        whereConditions.push(`FIND_IN_SET(item_masterr.id, employees_moz.product) > 0 AND item_masterr.id IN (${productIds})`);
    }
    if (site !== '' && site !== undefined && site != null) {
        whereConditions.push(`employees_moz.site='${site}'`);
    }
    if (shift !== '' && shift !== undefined && shift != null) {
        whereConditions.push(`employees_moz.shift='${shift}'`);
    }
    if (sectionIds !== '' && sectionIds !== undefined && sectionIds != null) {
        whereConditions.push(`FIND_IN_SET(section.id, employees_moz.section_id) > 0 AND section.id IN (${sectionIds})`);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
            SELECT employees_moz.*, 
                   IFNULL(GROUP_CONCAT(DISTINCT item_masterr.item_description),'') as item_names,
                   IFNULL(GROUP_CONCAT(DISTINCT section.section_name),'') as section_names,
                   geopos_emptype.name as emptype
            FROM employees_moz
            LEFT JOIN item_masterr ON FIND_IN_SET(item_masterr.id, employees_moz.product) > 0
            LEFT JOIN geopos_emptype ON employees_moz.roleid = geopos_emptype.id
            LEFT JOIN section ON FIND_IN_SET(section.id, employees_moz.section_id) > 0
            WHERE ${whereClause}
            GROUP BY employees_moz.id
        `;
    const workersWithDetails = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
    });
    return workersWithDetails;
};

exports.getActiveWorkersCount = async (site = null) => {
    const roleId = 1;
    const passiveType = 'ACT';
    const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");

    let query = `
            SELECT COUNT(*) as rowCount 
            FROM employees_moz 
            WHERE roleid = :roleId 
            AND passive_type = :passiveType 
            AND date = :currentDate
        `;
    const replacements = { roleId, passiveType, currentDate };
    if (site) {
        query += ' AND site = :site';
        replacements.site = site;
    }
    const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT
    });
    const rowCount = result[0].rowCount;
    return rowCount;
};

exports.getPresentWorkersCount = async (site = null) => {
    const roleId = 1;
    const passiveType = 'ACT';
    const status = 'P';
    const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");

    let query = `
            SELECT COUNT(*) as rowCount 
            FROM employees_moz 
            WHERE roleid = :roleId 
            AND passive_type = :passiveType 
            AND date = :currentDate
            AND status = :status
        `;
    const replacements = { roleId, passiveType, currentDate, status };
    if (site) {
        query += ' AND site = :site';
        replacements.site = site;
    }
    const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT
    });
    const rowCount = result[0].rowCount;
    return rowCount;
};

exports.getAbsentWorkersCount = async (site = null) => {
    const roleId = 1;
    const passiveType = 'ACT';
    const status = 'A';
    const currentDate = dateUtils.getCurrentDate("DD-MM-YYYY");

    let query = `
            SELECT COUNT(*) as rowCount 
            FROM employees_moz 
            WHERE roleid = :roleId 
            AND passive_type = :passiveType 
            AND date = :currentDate
            AND status = :status
        `;
    const replacements = { roleId, passiveType, currentDate, status };
    if (site) {
        query += ' AND site = :site';
        replacements.site = site;
    }
    const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT
    });
    const rowCount = result[0].rowCount;
    return rowCount;
};

exports.deleteWorker = async (workerId) => {
    return await Employee.destroy({ where: { id: workerId, roleid: 1 } });
};

exports.getWorkerZones = async (queryParams) => {
    const { productIds, sectionIds, site, shift } = queryParams;
    const roleId = 1;
    let whereConditions = [];
    whereConditions.push(`employees_moz.roleid = ${roleId}`);
    whereConditions.push(`employees_moz.passive_type = 'ACT'`);

    if (productIds !== '' && productIds !== undefined && productIds != null) {
        whereConditions.push(`FIND_IN_SET(item_masterr.id, employees_moz.product) > 0 AND item_masterr.id IN (${productIds})`);
    }
    if (sectionIds !== '' && sectionIds !== undefined && sectionIds != null) {
        whereConditions.push(`FIND_IN_SET(section.id, employees_moz.section_id) > 0 AND section.id IN (${sectionIds})`);
    }
    if (site !== '' && site !== undefined && site != null) {
        whereConditions.push(`employees_moz.site='${site}'`);
    }
    if (shift !== '' && shift !== undefined && shift != null) {
        whereConditions.push(`employees_moz.shift='${shift}'`);
    }
    const whereClause = whereConditions.join(' AND ');

    const query = `
  SELECT employees_moz.*, 
         GROUP_CONCAT(DISTINCT item_masterr.item_description) as item_names,
         GROUP_CONCAT(DISTINCT section.section_name) as section_names, 
         geopos_emptype.name as emptype
  FROM employees_moz
  LEFT JOIN item_masterr ON FIND_IN_SET(item_masterr.id, employees_moz.product) > 0
  LEFT JOIN geopos_emptype ON employees_moz.roleid = geopos_emptype.id
  LEFT JOIN section ON FIND_IN_SET(section.id, employees_moz.section_id) > 0
  WHERE ${whereClause}
  GROUP BY employees_moz.id
`;
    const zones = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
    });

    const result = {
        shift: shift,
        site: site,
        sectionIds: sectionIds,
        productIds: productIds,
        data: zones
    };

    return result;
};