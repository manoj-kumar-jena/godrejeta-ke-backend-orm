// services/userService.js
const User = require('../models/User');
const { Sequelize, Op } = require('sequelize');
const { hashPassword } = require('../utils/passwordUtils');
const { CustomError } = require('../utils/error');

exports.getAllUsers = async () => {
    const users = await User.findAll({
        where: {
            banned: 0
        }
    });
    return users;
};

exports.getUserById = async (userId) => {
    return await User.findByPk(userId);
};

exports.getUsersByRoleId = async (roleId) => {
    // Find all users based on role ID
    const users = await User.findAll({
        where: {
            roleid: roleId,
            banned: 0
        }
    });
    return users;
};

exports.getUserByIdOrEntryId = async (id) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { id: id },
                { entryid: id }
            ]
        }
    });
    return user;
};

exports.getUserByEmail = async (email) => {
    return User.findOne({ where: { email } });
};

exports.updateUserPassword = async (userId, confirmPassword) => {
    // Check if the user exists
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
        throw new CustomError(404, 'User not found');
    }
    // Use the hashPassword utility function
    const hashedPassword = await hashPassword(confirmPassword, userId);
    // Update the user
    await User.update({ pass: hashedPassword }, { where: { id: userId } });
    return { message: "User password updated successfully" };
};

exports.updateUserLanguage = async (userId, language) => {
    // Check if the user exists
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
        throw new CustomError(404, 'User not found');
    }
    // Update the user
    await User.update({ lang: language }, { where: { id: userId } });
    return { message: "User language updated successfully" };
};