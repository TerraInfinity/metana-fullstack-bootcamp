/**
 * @module PointTypesModel
 * @description Sequelize model for Point Types, representing different types of points in the application.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

/**
 * PointTypes model definition.
 * @typedef {Object} PointTypes
 * @property {string} id - Unique identifier for the point type, generated as a UUID.
 * @property {string} name - Name of the point type, must be unique.
 * @property {string} description - Description of the point type, cannot be null.
 */
const PointTypes = sequelize.define('PointTypes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Disable timestamps for this model
});

module.exports = PointTypes;