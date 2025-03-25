/**
 * @module Paths
 * @description Sequelize model representing Paths in the application.
 * Each path has a unique identifier, a name, and associated perks.
 * Paths are linked to PointTypes and Achievements.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const PointTypes = require('./pointTypesModel');
const Achievements = require('./achievementsModel');

const Paths = sequelize.define('Paths', {
    /**
     * Unique identifier for the path.
     * @type {UUID}
     * @default {UUIDV4}
     */
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    /**
     * Name of the path.
     * Must be unique across all paths.
     * @type {String}
     */
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    /**
     * Array of perks associated with the path.
     * @type {Array<String>}
     * @required
     */
    perks: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    timestamps: false
});

// Association with PointTypes
/**
 * Establishes a relationship where each path belongs to a specific PointType.
 * @param {Object} options - Options for the association.
 * @param {String} options.foreignKey - The foreign key in the Paths table.
 */
Paths.belongsTo(PointTypes, { foreignKey: 'pointTypeId' });

// Association with Achievements
/**
 * Establishes a relationship where each path can have multiple Achievements.
 * @param {Object} options - Options for the association.
 * @param {String} options.foreignKey - The foreign key in the Achievements table.
 */
Paths.hasMany(Achievements, { foreignKey: 'pathId' });

module.exports = Paths;