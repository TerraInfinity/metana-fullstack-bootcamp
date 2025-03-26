/**
 * @fileoverview Defines the BlogPoints model schema for the blog application.
 * This model represents the points associated with a blog post, including
 * various attributes such as blog ID, point type, and associated achievements.
 * 
 * @module models/blogModel/blogPointsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogPoints extends Model {}

/**
 * Initializes the BlogPoints model with its attributes and constraints.
 * 
 * @static
 * @param {Object} sequelize - The Sequelize instance for database connection.
 * @param {Object} DataTypes - The data types used for defining model attributes.
 */
BlogPoints.init({
    /**
     * Unique identifier for the blog post.
     * @type {UUID}
     * @required
     */
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    /**
     * Unique identifier for the type of point.
     * @type {UUID}
     * @required
     * @default {UUIDV4}
     */
    pointTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    /**
     * The number of points associated with the blog post.
     * @type {Integer}
     * @required
     */
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /**
     * Unique identifier for the path associated with the blog post.
     * @type {UUID}
     * @required
     * @default {UUIDV4}
     */
    pathId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    /**
     * Unique identifier for the achievement associated with the blog post.
     * @type {UUID}
     * @optional
     * @default {UUIDV4}
     */
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