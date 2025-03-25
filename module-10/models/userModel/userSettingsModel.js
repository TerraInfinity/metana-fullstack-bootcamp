/**
 * @file User settings model for managing site and account preferences.
 * @module models/userModel/userSettingsModel
 * @description This module defines the UserSettings model, which is used to store user-specific settings such as theme preferences and notification settings.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents the UserSettings model.
 * @extends Model
 */
class UserSettings extends Model {}

/**
 * Initializes the UserSettings model with its attributes and options.
 * @static
 * @returns {void}
 */
UserSettings.init({
    /**
     * Unique identifier for the user associated with these settings.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },

    /**
     * User's theme preference, which can be either 'light' or 'dark'.
     * @type {String}
     * @default 'light'
     * @validate {isIn} ['light', 'dark']
     */
    theme: {
        type: DataTypes.STRING,
        defaultValue: 'light',
        validate: {
            isIn: [
                ['light', 'dark']
            ]
        }
    },

    /**
     * User's notification preferences stored in JSON format.
     * @type {JSON}
     * @allowNull true
     */
    notificationPreferences: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'UserSettings',
    tableName: 'user_settings',
    timestamps: true
});

module.exports = UserSettings;