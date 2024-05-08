// services/authService.js
const jwt = require('jsonwebtoken');

const properties = require(`../properties/properties.json`);
const environment = properties.env.environment || 'development';
const config = require(`../config/config.${environment}.json`);

const { hashPassword } = require('../utils/passwordUtils'); // Import the hashPassword utility function

const sequelize = require('../database/connection'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
//OR
const User = require('../models/User');
const { CustomError } = require('../utils/error');

// Generate JWT token for user
exports.generateToken = (userId, roleid, email, entryid) => {
    return jwt.sign({ id: userId, roleid, email, entryid }, config.auth.secretKey, { expiresIn: '1h' });
};

// Verify user credentials and generate token
exports.authenticateUser = async (email, password) => {
    //const user = await User.findOne({ where: { email } });

    // Define your custom SQL query
    const query = `
            SELECT id, roleid, username, entryid, email, pass
            FROM geopos_users
            WHERE (email = :email OR username = :email)
            AND banned = 0
        `;

    // Execute the custom query
    const [user] = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { email }
    });
    if (user == undefined || !user) {
        throw new CustomError(401, 'Invalid email or password');
    }
    const hashedPassword = await hashPassword(password, user.id); // Use the hashPassword utility function
    if (hashedPassword !== user.pass) {
        throw new CustomError(401, 'Invalid email or password');
    }
    const token = this.generateToken(user.id, user.roleid, user.email, user.entryid);
    return token;
};
