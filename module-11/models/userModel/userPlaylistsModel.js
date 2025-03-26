/**
 * @file User playlists model for managing user playlists in the application.
 * @module models/userModel/userPlaylistsModel
 * 
 * This model represents the playlists created by users, including the playlist's
 * name and the items contained within it. It utilizes Sequelize for ORM functionality.
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents a user's playlist.
 * @extends Model
 */
class UserPlaylists extends Model {}

/**
 * Initializes the UserPlaylists model with its attributes and options.
 * @static
 */
UserPlaylists.init({
    /**
     * Unique identifier for the playlist.
     * @type {UUID}
     * @default {UUIDV4}
     */
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

    /**
     * Identifier for the user who owns the playlist.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, allowNull: false },

    /**
     * Name of the playlist.
     * @type {String}
     * @required
     * @set {Function} Trims whitespace from the playlist name before saving.
     */
    playlistName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) { this.setDataValue('playlistName', value.trim()); },
        validate: { notEmpty: true }
    },

    /**
     * Items contained in the playlist.
     * @type {JSON}
     * @optional
     */
    items: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'UserPlaylists',
    tableName: 'user_playlists',
    timestamps: true
});

module.exports = UserPlaylists;