/**
 * @file User privacy settings model for visibility preferences.
 * @module models/userModel/privacySettingsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class PrivacySettings extends Model {}

PrivacySettings.init({
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },
    profileVisibility: {
        type: DataTypes.STRING,
        defaultValue: 'public',
        validate: {
            isIn: [
                ['private', 'public', 'friends']
            ]
        }
    },
    blogVisibility: {
        type: DataTypes.STRING,
        defaultValue: 'public',
        validate: {
            isIn: [
                ['private', 'public', 'friends']
            ]
        }
    }
}, {
    sequelize,
    modelName: 'PrivacySettings',
    tableName: 'privacy_settings',
    timestamps: true
});

module.exports = PrivacySettings;