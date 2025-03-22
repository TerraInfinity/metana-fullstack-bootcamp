/**
 * @fileoverview Core Blog model schema definition for the blog application using Sequelize for PostgreSQL.
 * This file defines the Blog model schema, including fields, validation rules, and associations.
 * @module models/coreBlogModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const Paths = require('./common/pathsModel');

/**
 * Represents a Blog model, which encapsulates the structure and behavior of blog entries.
 * @class
 * @extends Model
 */
class Blog extends Model {}

/**
 * Initializes the Blog model schema with various properties and their validation rules.
 * @memberof Blog
 * @static
 */
Blog.init({
    /**
     * Unique identifier for the blog entry.
     * @property {DataTypes.UUID} id - The primary key for the blog, automatically generated.
     * @defaultValue {DataTypes.UUIDV4}
     */
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    /**
     * Title of the blog entry.
     * @property {DataTypes.STRING(100)} title - The title must be a non-empty string with a maximum length of 100 characters.
     * @allowNull {false}
     * @validate {notEmpty: { msg: 'Please provide a title' }, len: [1, 100]}
     */
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value) { this.setDataValue('title', value.trim()); },
        validate: { notEmpty: { msg: 'Please provide a title' }, len: [1, 100] }
    },
    /**
     * Content of the blog entry.
     * @property {DataTypes.TEXT} content - The main body of the blog, must not be empty.
     * @allowNull {false}
     * @validate {notEmpty: { msg: 'Please provide content' }}
     */
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value) { this.setDataValue('content', value.trim()); },
        validate: { notEmpty: { msg: 'Please provide content' } }
    },
    /**
     * Summary of the blog entry.
     * @property {DataTypes.TEXT} blogSummary - An optional brief overview of the blog content.
     * @allowNull {true}
     */
    blogSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * ID of the author of the blog entry.
     * @property {DataTypes.UUID} authorId - Optional identifier linking to the author.
     * @allowNull {true}
     */
    authorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    /**
     * Indicates whether the blog entry is age-restricted.
     * @property {DataTypes.BOOLEAN} isAgeRestricted - Optional flag for age-restriction status.
     * @allowNull {true}
     */
    isAgeRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    /**
     * URL of a video associated with the blog entry.
     * @property {DataTypes.STRING} videoUrl - Optional link to a video.
     * @allowNull {true}
     */
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * URL of an audio file associated with the blog entry.
     * @property {DataTypes.STRING} audioUrl - Optional link to an audio file.
     * @allowNull {true}
     */
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * URL of the blog entry's image.
     * @property {DataTypes.STRING} blogImage - Optional link to an image representing the blog.
     * @allowNull {true}
     */
    blogImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    /**
     * Website of the author of the blog entry.
     * @property {DataTypes.STRING} authorWebsite - Optional link to the author's website.
     * @allowNull {true}
     */
    authorWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * URL of the author's logo.
     * @property {DataTypes.STRING} authorLogo - Optional link to the author's logo image.
     * @allowNull {true}
     */
    authorLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * Disclaimer text for the blog entry.
     * @property {DataTypes.TEXT} disclaimer - Optional disclaimer information.
     * @allowNull {true}
     */
    disclaimer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * Easter egg text for the blog entry.
     * @property {DataTypes.TEXT} easterEgg - Optional hidden message or feature.
     * @allowNull {true}
     */
    easterEgg: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * Name of the author of the blog entry.
     * @property {DataTypes.STRING(69)} authorName - Optional name of the author.
     * @allowNull {true}
     */
    authorName: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    /**
     * Featured status of the blog entry.
     * @property {DataTypes.STRING(69)} featured - Optional flag indicating if the blog is featured.
     * @allowNull {true}
     */
    featured: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    /**
     * ID of the path associated with the blog entry.
     * @property {DataTypes.UUID} pathId - Optional identifier linking to a specific path.
     * @allowNull {true}
     */
    pathId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    /**
     * Role of the user associated with the blog entry.
     * @property {DataTypes.STRING} role - Defines the user's role, can be 'user', 'editor', 'creator', or 'admin'.
     * @default {user}
     */
    role: {
        type: DataTypes.STRING,
        enum: ['user', 'editor', 'creator', 'admin'],
        default: 'user',
    },
}, {
    sequelize,
    modelName: 'Blog',
    tableName: 'blogs',
    timestamps: true
});

// Define associations after model initialization
const BlogComment = require('./blogModel/blogCommentModel');

/**
 * Defines the association between the Blog model and the BlogComment model.
 * @memberof Blog
 * @static
 */
Blog.hasMany(BlogComment, { foreignKey: 'blogId' });

/**
 * Defines the association between the Blog model and the Paths model.
 * @memberof Blog
 * @static
 */
Blog.belongsTo(Paths, { foreignKey: 'pathId' });

module.exports = Blog;