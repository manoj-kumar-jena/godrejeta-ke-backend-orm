// routes/operatorAssignmentRoutes.js

const express = require('express');
const router = express.Router();
const operatorAssignmentController = require('../controllers/operatorAssignmentController');

router.get('/:operatorId', operatorAssignmentController.getAssignmentsByOperatorId);
router.post('/', operatorAssignmentController.addAssignment);
router.put('/', operatorAssignmentController.updateAssignment);
router.get('/', operatorAssignmentController.getAllAssignments);
router.delete('/:id', operatorAssignmentController.deleteAssignment);

module.exports = router;
