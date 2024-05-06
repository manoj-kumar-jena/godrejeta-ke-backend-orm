// routes/itemSectionRoutes.js
const express = require('express');
const router = express.Router();
const itemSectionController = require('../controllers/itemSectionController');

// Define routes
router.get('/item/:itemId', itemSectionController.getItemSectionsByItemId);
router.get('/:id', itemSectionController.getItemSectionById);
router.put('/:id', itemSectionController.updateItemSection);
router.delete('/:id', itemSectionController.deleteItemSection);

module.exports = router;
