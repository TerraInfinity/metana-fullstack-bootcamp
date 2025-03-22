/**
 * @module AchievementsModel
 * @description This module defines the Achievements model for the Sequelize ORM.
 * The Achievements model represents the achievements that can be earned by users,
 * including their properties such as name, description, and leveling modifiers.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

// Define the Achievements model
const Achievements = sequelize.define('Achievements', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Unique identifier for each achievement
    },
    name: {
        type: DataTypes.STRING,
        unique: true, // Name must be unique across all achievements
    },
    description: {
        type: DataTypes.TEXT, // Detailed description of the achievement
    },
    perkLevelingModifier: {
        type: DataTypes.FLOAT,
        allowNull: true, // Optional modifier for leveling perks
    },
    pathId: {
        type: DataTypes.UUID,
        references: {
            model: 'Paths', // Reference to the Paths model
            key: 'id', // Foreign key in the Paths model
        },
    },
}, {
    timestamps: false, // Disable automatic timestamps
});

// Export the Achievements model
module.exports = Achievements;