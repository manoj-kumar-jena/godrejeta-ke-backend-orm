// controllers/userController.js
const userService = require('../services/userService');

exports.getUserByEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        const user = await userService.getUserByEmail(email);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await userService.createUser(username, email, password);
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

