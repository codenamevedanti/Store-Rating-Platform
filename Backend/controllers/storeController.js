const { Op, fn, col, literal } = require('sequelize');
const { Store, User, Rating } = require('../models');

// GET /api/stores  — All authenticated users (normal user: search by name/address)
const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSort = ['name', 'address', 'email', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      attributes: [
        'id', 'name', 'email', 'address', 'owner_id',
        [fn('ROUND', fn('AVG', col('Ratings.value')), 1), 'avgRating'],
      ],
      include: [
        {
          model: Rating,
          attributes: [],
          required: false,
        },
      ],
      group: ['Store.id'],
      order: [[sortField, sortOrder]],
    });

    return res.json(stores);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/stores  — Admin only
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, email, and address are required.' });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: 'Store name must be between 20 and 60 characters.' });
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Store email already in use.' });

    // If owner_id given, verify they are a store_owner role
    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'owner_id must reference a store_owner user.' });
      }
    }

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });
    return res.status(201).json({ message: 'Store created.', store });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/stores/:id  — Get single store detail
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      attributes: [
        'id', 'name', 'email', 'address', 'owner_id',
        [fn('ROUND', fn('AVG', col('Ratings.value')), 1), 'avgRating'],
      ],
      include: [{ model: Rating, attributes: [] }],
      group: ['Store.id'],
    });

    if (!store) return res.status(404).json({ message: 'Store not found.' });

    return res.json(store);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/stores/owner/dashboard  — Store owner: see ratings for their store
const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) return res.status(404).json({ message: 'No store found for this owner.' });

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[fn('ROUND', fn('AVG', col('value')), 1), 'avgRating']],
      raw: true,
    });

    return res.json({
      store: { id: store.id, name: store.name, address: store.address },
      avgRating: avgResult?.avgRating || null,
      ratings,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllStores, createStore, getStoreById, getOwnerDashboard };