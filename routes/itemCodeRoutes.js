// routes/itemCodeRoutes.js
const express = require('express');
const router = express.Router();
const itemCodeController = require('../controllers/itemCodeController');

// Create a new item code for given item
router.post('/:itemId', itemCodeController.createItemCode);
// Get all item codes by item ID
router.get('/item/:itemId', itemCodeController.getItemCodesByItemId);
// Get item code by ID
router.get('/:id', itemCodeController.getItemCodeById);
// Update item code by ID
router.put('/:id', itemCodeController.updateItemCode);
// Delete item code by ID
router.delete('/:id', itemCodeController.deleteItemCode);

module.exports = router;
