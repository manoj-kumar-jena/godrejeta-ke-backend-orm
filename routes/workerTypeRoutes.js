// routes/workerTypeRoutes.js
const express = require('express');
const router = express.Router();
const workerTypeController = require('../controllers/workerTypeController');

// Define routes
router.post('/', workerTypeController.createWorkerType);
router.get('/', workerTypeController.getAllWorkerTypes);

module.exports = router;
