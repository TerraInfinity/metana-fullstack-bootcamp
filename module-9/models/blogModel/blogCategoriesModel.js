/**
 * @fileoverview Blog Categories model schema definition for the blog application using Sequelize for PostgreSQL.
 * @module models/blogModel/blogCategoriesModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogCategories extends Model {}

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

module.exports = BlogCategories;