/**
 * @file User profile model for managing user experience, achievements, and avatar.
 * @module models/userModel/userProfileModel
 * 
 * This module defines the UserProfile model, which represents the user's profile
 * information in the database, including their experience points, achievements,
 * and avatar URL.
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents a user profile in the application.
 * @extends Model
 */
class UserProfile extends Model {}

/**
 * Initializes the UserProfile model with its attributes and options.
 * @static
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The data types used for model attributes.
 */
UserProfile.init({
    /**
     * Unique identifier for the user associated with this profile.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },

    /**
     * Total experience points accumulated by the user.
     * @type {Integer}
     * @default 0
     */
    experiencePoints: { type: DataTypes.INTEGER, defaultValue: 0 },

    /**
     * Achievements earned by the user, stored in JSON format.
     * @type {JSON}
     * @nullable
     */
    achievements: { type: DataTypes.JSON, allowNull: true },

    /**
     * URL of the user's avatar image.
     * @type {String}
     * @nullable
     */
    avatarUrl: { type: DataTypes.STRING, allowNull: true }
}, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true
});

module.exports = UserProfile;