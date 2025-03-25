/**
 * @file User privacy settings model for managing visibility preferences.
 * @module models/userModel/privacySettingsModel
 * 
 * This module defines the PrivacySettings model, which is used to store
 * user-specific privacy settings related to profile and blog visibility.
 * 
 * @see {@link https://sequelize.org/} for more information on Sequelize.
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents the privacy settings for a user.
 * 
 * @extends Model
 */
class PrivacySettings extends Model {}

/**
 * Initializes the PrivacySettings model with its attributes and options.
 * 
 * @static
 * @param {Object} sequelize - The Sequelize instance.
 * @returns {void}
 */
PrivacySettings.init({
    /**
     * Unique identifier for the user associated with these privacy settings.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },

    /**
     * Visibility setting for the user's profile.
     * Can be 'private', 'public', or 'friends'.
     * @type {String}
     * @default 'public'
     * @validation {Array} isIn - Allowed values for profile visibility.
     */
    profileVisibility: {
        type: DataTypes.STRING,
        defaultValue: 'public',
        validate: {
            isIn: [
                ['private', 'public', 'friends']
            ]
        }
    },

    /**
     * Visibility setting for the user's blog.
     * Can be 'private', 'public', or 'friends'.
     * @type {String}
     * @default 'public'
     * @validation {Array} isIn - Allowed values for blog visibility.
     */
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