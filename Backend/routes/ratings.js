const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { submitRating, updateRating, getMyRatings } = require('../controllers/ratingController');

// Normal users only
router.get('/my', authenticate, roleCheck('user'), getMyRatings);
router.post('/', authenticate, roleCheck('user'), submitRating);
router.put('/:id', authenticate, roleCheck('user'), updateRating);

module.exports = router;