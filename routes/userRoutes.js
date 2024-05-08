// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/role/:roleId', userController.getUsersByRoleId);
router.get('/:id', userController.getUserByIdOrEntryId);
router.get('/', userController.getAllUsers);
router.put('/update-password', userController.updateUserPassword);
router.put('/update-language', userController.updateUserLanguage);

module.exports = router;
