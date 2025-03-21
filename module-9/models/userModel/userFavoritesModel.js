/**
 * @file User favorites model for tracking favorite items.
 * @module models/userModel/userFavoritesModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class UserFavorites extends Model {}

UserFavorites.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false },
    favoriteItemId: { type: DataTypes.UUID, allowNull: false },
    itemType: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } }
}, {
    sequelize,
    modelName: 'UserFavorites',
    tableName: 'user_favorites',
    timestamps: true,
    indexes: [{ fields: ['userId', 'favoriteItemId'], unique: true }]
});

module.exports = UserFavorites;