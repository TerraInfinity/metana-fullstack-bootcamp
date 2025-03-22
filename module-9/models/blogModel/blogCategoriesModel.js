/**
 * @fileoverview Defines the BlogCategories model schema for the blog application.
 * This model represents the relationship between blogs and categories using Sequelize for PostgreSQL.
 * 
 * @module models/blogModel/blogCategoriesModel
 * @class BlogCategories
 * @extends Model
 * 
 * @property {UUID} blogId - The unique identifier for the blog. This serves as a foreign key.
 * @property {UUID} categoryId - The unique identifier for the category. This serves as a foreign key.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogCategories extends Model {}

/**
 * Initializes the BlogCategories model with its attributes and configuration.
 */
BlogCategories.init({
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize,
    modelName: 'BlogCategories',
    tableName: 'blog_categories',
    timestamps: false
});

// Exporting the BlogCategories model for use in other parts of the application.
module.exports = BlogCategories;