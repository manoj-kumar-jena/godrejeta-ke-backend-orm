// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET user by email
router.get('/user/:email', userController.getUserByEmail);
// POST register
router.post('/register', userController.register);

module.exports = router;
