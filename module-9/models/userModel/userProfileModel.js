/**
 * @file User profile model for experience, achievements, and avatar.
 * @module models/userModel/userProfileModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class UserProfile extends Model {}

UserProfile.init({
    userId: { type: DataTypes.UUID, unique: true, allowNull: false },
    experiencePoints: { type: DataTypes.INTEGER, defaultValue: 0 },
    achievements: { type: DataTypes.JSON, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true }
}, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true
});

module.exports = UserProfile;