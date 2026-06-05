const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Associations
User.hasMany(Rating, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Rating, { foreignKey: 'store_id', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

User.hasOne(Store, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

module.exports = { sequelize, User, Store, Rating };