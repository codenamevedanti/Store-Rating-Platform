const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateUserInput, validateEmail, validatePassword } = require('../validations/validators');

// POST /api/auth/register  (Normal users only)
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const errors = validateUserInput({ name, email, password, address });
    if (errors) return res.status(400).json({ errors });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: 'user' });

    return res.status(201).json({ message: 'Registration successful.', userId: user.id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/change-password  (authenticated)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const passErr = validatePassword(newPassword);
    if (passErr) return res.status(400).json({ message: passErr });

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, changePassword };