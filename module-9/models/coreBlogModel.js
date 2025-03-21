/**
 * @fileoverview Core Blog model schema definition for the blog application using Sequelize for PostgreSQL.
 * This file defines the Blog model schema, including fields and validation rules.
 * @module models/coreBlogModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const Paths = require('./common/pathsModel');

/**
 * Represents a Blog model.
 * @class
 * @extends Model
 */
class Blog extends Model {}

/**
 * Initializes the Blog model schema.
 * @memberof Blog
 */
Blog.init({
    /**
     * Unique identifier for the blog.
     * @property id
     * @type {DataTypes.UUID}
     * @primaryKey
     * @defaultValue {DataTypes.UUIDV4}
     */
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    /**
     * Title of the blog.
     * @property title
     * @type {DataTypes.STRING(100)}
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
     * Content of the blog.
     * @property content
     * @type {DataTypes.TEXT}
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
     * Summary of the blog.
     * @property blogSummary
     * @type {DataTypes.TEXT}
     * @allowNull {true}
     */
    blogSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * ID of the author.
     * @property authorId
     * @type {DataTypes.UUID}
     * @allowNull {true}
     */
    authorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    /**
     * Whether the blog is age-restricted.
     * @property isAgeRestricted
     * @type {DataTypes.BOOLEAN}
     * @allowNull {true}
     */
    isAgeRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    /**
     * URL of the video.
     * @property videoUrl
     * @type {DataTypes.STRING}
     * @allowNull {true}
     */
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * URL of the audio.
     * @property audioUrl
     * @type {DataTypes.STRING}
     * @allowNull {true}
     */
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * URL of the blog image.
     * @property blogImage
     * @type {DataTypes.STRING}
     * @allowNull {true}
     */
    blogImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    /**
     * Website of the author.
     * @property authorWebsite
     * @type {DataTypes.STRING}
     * @allowNull {true}
     */
    authorWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * Logo of the author.
     * @property authorLogo
     * @type {DataTypes.STRING}
     * @allowNull {true}
     */
    authorLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * Disclaimer of the blog.
     * @property disclaimer
     * @type {DataTypes.TEXT}
     * @allowNull {true}
     */
    disclaimer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * Easter egg of the blog.
     * @property easterEgg
     * @type {DataTypes.TEXT}
     * @allowNull {true}
     */
    easterEgg: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    /**
     * Name of the author.
     * @property authorName
     * @type {DataTypes.STRING(69)}
     * @allowNull {true}
     */
    authorName: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    /**
     * Featured status of the blog.
     * @property featured
     * @type {DataTypes.STRING(69)}
     * @allowNull {true}
     */
    featured: {
        type: DataTypes.STRING(69),
        allowNull: true,
    },
    /**
     * ID of the path.
     * @property pathId
     * @type {DataTypes.UUID}
     * @allowNull {true}
     */
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

/**
 * Defines the association between Blog and BlogComment.
 * @memberof Blog
 */
Blog.hasMany(BlogComment, { foreignKey: 'blogId' });

/**
 * Defines the association between Blog and Paths.
 * @memberof Blog
 */
Blog.belongsTo(Paths, { foreignKey: 'pathId' });

module.exports = Blog;