const { Rating, Store } = require('../models');

// POST /api/ratings  — Normal user: submit rating
const submitRating = async (req, res) => {
  try {
    const { store_id, value } = req.body;

    if (!store_id || !value) {
      return res.status(400).json({ message: 'store_id and value are required.' });
    }
    if (value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const store = await Store.findByPk(store_id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });

    // Check if user already rated this store
    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id } });
    if (existing) {
      return res.status(409).json({ message: 'You have already rated this store. Use PUT to update.' });
    }

    const rating = await Rating.create({ user_id: req.user.id, store_id, value });
    return res.status(201).json({ message: 'Rating submitted.', rating });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/ratings/:id  — Normal user: update their rating
const updateRating = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const rating = await Rating.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found or not yours.' });
    }

    rating.value = value;
    await rating.save();

    return res.json({ message: 'Rating updated.', rating });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/ratings/my  — Normal user: get all their ratings
const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Store, attributes: ['id', 'name', 'address'] }],
    });

    return res.json(ratings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { submitRating, updateRating, getMyRatings };