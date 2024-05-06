// routes/itemCategoryRoutes.js
const express = require('express');
const router = express.Router();
const itemCategoryController = require('../controllers/itemCategoryController');

/**
 * @swagger
 * tags:
 *   - name: Item Categories
 *     description: Endpoints for managing item categories
 */

/**
 * @swagger
 * /api/item-categories:
 *   get:
 *     summary: Get all item categories
 *     description: Retrieve a list of all item categories.
 *     tags: [Item Categories]
 *     responses:
 *       200:
 *         description: A list of item categories
 *       500:
 *         description: Internal server error
 */

router.get('/', itemCategoryController.getAllItemCategories);

/**
 * @swagger
 * /api/item-categories:
 *   post:
 *     summary: Create a new item category
 *     description: Endpoint to create a new item category.
 *     tags: [Item Categories]
 *     responses:
 *       200:
 *         description: Item category created successfully
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', itemCategoryController.createItemCategory);

module.exports = router;
