/**
 * @file User playlists model for managing user playlists.
 * @module models/userModel/userPlaylistsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class UserPlaylists extends Model {}

UserPlaylists.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false },
    playlistName: { type: DataTypes.STRING, allowNull: false, set(value) { this.setDataValue('playlistName', value.trim()); }, validate: { notEmpty: true } },
    items: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'UserPlaylists',
    tableName: 'user_playlists',
    timestamps: true
});

module.exports = UserPlaylists;