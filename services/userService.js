// services/userService.js
const User = require('../models/GeoposUser');

exports.getUserByEmail = async (email) => {
    return User.findOne({ where: { email } });
};
