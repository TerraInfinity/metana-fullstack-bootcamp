/**
 * @fileoverview Blog Points model schema definition for the blog application using Sequelize for PostgreSQL.
 * @module models/blogModel/blogPointsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogPoints extends Model {}

BlogPoints.init({
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    pointTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pathId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4

    },
    achievementId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: DataTypes.UUIDV4

    }
}, {
    sequelize,
    modelName: 'BlogPoints',
    tableName: 'blog_points',
    timestamps: true
});

module.exports = BlogPoints;