/**
 * @file User favorites model for tracking favorite items.
 * @module models/userModel/userFavoritesModel
 * 
 * This model represents the user's favorite items in the application.
 * It allows for the tracking of which items a user has marked as favorites.
 * 
 * @class UserFavorites
 * @extends Model
 * @property {UUID} id - The unique identifier for the favorite entry.
 * @property {UUID} userId - The unique identifier of the user who favorited the item.
 * @property {UUID} favoriteItemId - The unique identifier of the item that is favorited.
 * @property {string} itemType - The type of the item (e.g., product, article) that is favorited.
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