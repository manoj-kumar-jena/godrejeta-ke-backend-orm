// routes/targetPlanRoutes.js
const express = require('express');
const router = express.Router();
const targetPlanController = require('../controllers/targetPlanController');
const upload = require('../middleware/multerMiddleware');

// Define routes
router.post('/insert_or_update', targetPlanController.insertOrUpdate);
/**
 * @swagger
 * /api/target-plan/import:
 *   post:
 *     summary: Import data from Excel
 *     description: Import data from an Excel file and insert records into the target_plan table.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Data imported successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 *     tags:
 *       - Import
 *       - Excel
 *       - Data
 */
router.post('/import', upload.single('file'), targetPlanController.importFromExcel);
router.get('/datetime', targetPlanController.getTargetPlansByDatetime);
router.get('/this-month', targetPlanController.getTargetPlansForThisMonth);
router.delete('/:id', targetPlanController.deleteTargetPlan);

//router.post('/', targetPlanController.createTargetPlan);
//router.get('/:id', targetPlanController.getTargetPlanById);
//router.put('/:id', targetPlanController.updateTargetPlan);


module.exports = router;
