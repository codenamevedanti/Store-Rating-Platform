const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getAllUsers, getUserById, createUser, getDashboardStats } = require('../controllers/userController');

// Admin only
router.get('/dashboard', authenticate, roleCheck('admin'), getDashboardStats);
router.get('/', authenticate, roleCheck('admin'), getAllUsers);
router.get('/:id', authenticate, roleCheck('admin'), getUserById);
router.post('/', authenticate, roleCheck('admin'), createUser);

module.exports = router;