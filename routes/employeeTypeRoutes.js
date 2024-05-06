// routes/employeeTypeRoutes.js
const express = require('express');
const router = express.Router();
const employeeTypeController = require('../controllers/employeeTypeController');

// Define routes
router.get('/', employeeTypeController.getAllEmployeeTypes);
router.get('/:id', employeeTypeController.getEmployeeTypeById);

module.exports = router;
