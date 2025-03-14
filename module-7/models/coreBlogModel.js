/**
 * @fileoverview Core Blog model schema definition for the blog application using Sequelize for PostgreSQL.
 * @module models/coreBlogModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const Paths = require('./common/pathsModel');

class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value) { this.setDataValue('title', value.trim()); },
        validate: { notEmpty: { msg: 'Please provide a title' }, len: [1, 100] }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value) { this.setDataValue('content', value.trim()); },
        validate: { notEmpty: { msg: 'Please provide content' } }
    },
    blogSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    isAgeRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    blogImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    authorWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    authorLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disclaimer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    easterEgg: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    authorName: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    featured: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    pathId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Blog',
    tableName: 'blogs',
    timestamps: true
});

// Define associations after model initialization
const BlogComment = require('./blogModel/blogCommentModel');

Blog.hasMany(BlogComment, { foreignKey: 'blogId' });

Blog.belongsTo(Paths, { foreignKey: 'pathId' });

module.exports = Blog;