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

router.get('/worker/active-count', employeeController.getActiveWorkersCount);
router.get('/worker/total-absent', employeeController.getAbsentWorkersCount);
router.get('/worker/total-present', employeeController.getPresentWorkersCount);
router.get('/worker/zone', employeeController.getWorkerZones);
router.post('/worker', employeeController.addWorker);
router.get('/worker', employeeController.getEmployeesByRoleWorker);
router.delete('/worker/:id', employeeController.deleteWorker);
// Route to fetch employees by IDs
router.get('/:ids', employeeController.getEmployeesByIds);

module.exports = router;
