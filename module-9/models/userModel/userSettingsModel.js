/**
 * @file User settings model for site and account preferences.
 * @module models/userModel/userSettingsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class UserSettings extends Model {}

UserSettings.init({
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },
    theme: {
        type: DataTypes.STRING,
        defaultValue: 'light',
        validate: {
            isIn: [
                ['light', 'dark']
            ]
        }
    },
    notificationPreferences: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'UserSettings',
    tableName: 'user_settings',
    timestamps: true
});

module.exports = UserSettings;