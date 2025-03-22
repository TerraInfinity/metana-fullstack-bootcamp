/**
 * @module CategoriesModel
 * @description This module defines the Categories model for the database using Sequelize.
 * The Categories model represents a category with a unique identifier and name.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

/**
 * Represents the Categories model.
 * @type {Model}
 */
const Categories = sequelize.define('Categories', {
    id: {
        type: DataTypes.UUID, // Unique identifier for the category
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
        primaryKey: true // This field is the primary key
    },
    name: {
        type: DataTypes.STRING, // Name of the category
        unique: true // Category names must be unique
    }
}, {
    timestamps: false // Disable automatic timestamps
});

module.exports = Categories; // Export the Categories model for use in other modules