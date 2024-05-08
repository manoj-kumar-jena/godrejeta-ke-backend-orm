// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.put('/operator/update-shift', employeeController.updateOperatorsShift);
router.get('/operator/total-count', employeeController.getEmployeesCountByRoleOperator);
router.get('/operator/:id', employeeController.getOperatorById);
router.get('/operator', employeeController.getEmployeesByRoleOperator);
router.post('/operator', employeeController.addOperator);
router.put('/operator/disable/:entryId', employeeController.disableOperator);
router.put('/operator/enable/:entryId', employeeController.enableOperator);
router.put('/operator/:id', employeeController.updateOperator);
// Route to fetch employees by IDs
router.get('/:ids', employeeController.getEmployeesByIds);

module.exports = router;
