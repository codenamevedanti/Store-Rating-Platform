const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { validateUserInput } = require('../validations/validators');

// GET /api/users  — Admin: list all users with filters & sorting
const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
    });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id  — Admin: get user detail 
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, attributes: ['id', 'name'] }],
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    let avgRating = null;
    if (user.role === 'store_owner' && user.Store) {
      const result = await Rating.findOne({
        where: { store_id: user.Store.id },
        attributes: [[require('sequelize').fn('AVG', require('sequelize').col('value')), 'avgRating']],
        raw: true,
      });
      avgRating = result?.avgRating ? parseFloat(result.avgRating).toFixed(1) : null;
    }

    return res.json({ ...user.toJSON(), avgRating });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/users  — Admin: create user (any role)
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const errors = validateUserInput({ name, email, password, address });
    if (errors) return res.status(400).json({ errors });

    const validRoles = ['admin', 'user', 'store_owner'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: role || 'user' });

    return res.status(201).json({
      message: 'User created.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/users/dashboard  — Admin: stats
const getDashboardStats = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      User.count(),
      require('../models').Store.count(),
      Rating.count(),
    ]);

    return res.json({ totalUsers: usersCount, totalStores: storesCount, totalRatings: ratingsCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, getDashboardStats };