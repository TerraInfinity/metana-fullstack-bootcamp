/**
 * @file User activity feed model.
 * @module models/userModel/activityModel
 * @description This module defines the Activity model, which represents user activities 
 * in the application. Each activity is associated with a user and includes details about 
 * the type of activity and when it occurred.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents a user activity in the application.
 * @extends Model
 */
class Activity extends Model {}

/**
 * Initializes the Activity model with its attributes and configurations.
 * @static
 * @returns {void}
 */
Activity.init({
    /**
     * Unique identifier for the activity.
     * @type {UUID}
     * @default {UUIDV4}
     */
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

    /**
     * Identifier for the user associated with the activity.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, allowNull: false },

    /**
     * Type of activity performed by the user.
     * @type {String}
     * @required
     * @validation {notEmpty} Ensures the activity type is not empty.
     */
    activityType: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },

    /**
     * Timestamp of when the activity occurred.
     * @type {Date}
     * @default {NOW}
     */
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    /**
     * Additional details about the activity.
     * @type {JSON}
     * @allowNull {true}
     */
    details: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: false // timestamp field is manually managed
});

// Exporting the Activity model for use in other parts of the application.
module.exports = Activity;