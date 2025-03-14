/**
 * @file User activity feed model.
 * @module models/userModel/activityModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class Activity extends Model {}

Activity.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false },
    activityType: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    details: { type: DataTypes.JSON, allowNull: true }
}, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: false // timestamp field is manually managed
});

module.exports = Activity;