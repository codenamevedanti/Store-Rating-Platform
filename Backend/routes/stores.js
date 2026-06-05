const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getAllStores, createStore, getStoreById, getOwnerDashboard } = require('../controllers/storeController');

// Store owner dashboard
router.get('/owner/dashboard', authenticate, roleCheck('store_owner'), getOwnerDashboard);

// All authenticated users
router.get('/', authenticate, getAllStores);
router.get('/:id', authenticate, getStoreById);

// Admin only
router.post('/', authenticate, roleCheck('admin'), createStore);

module.exports = router;