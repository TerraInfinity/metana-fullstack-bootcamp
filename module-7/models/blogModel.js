/**
 * @fileoverview Blog model schema definition for the blog application using Sequelize for PostgreSQL
 * @module models/blogModel
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Assuming db.js exports the Sequelize instance
const User = require('./userModel'); // Assuming User model is defined in userModel.js

/**
 * Blog Model
 * @typedef {Object} BlogModel
 * @property {number} id - Auto-incrementing primary key
 * @property {string} title - The title of the blog post (required, max 100 chars)
 * @property {string} content - The content of the blog post (required)
 * @property {number} authorId - Foreign key referencing the User who created the post
 * @property {Date} createdAt - Timestamp when the blog was created (auto-generated)
 * @property {Date} updatedAt - Timestamp when the blog was last updated (auto-generated)
 */
const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4 // Automatically generate UUIDs
    },
    title: {
        type: DataTypes.STRING(100), // Limits title to 100 characters
        allowNull: false,
        set(value) {
            this.setDataValue('title', value.trim()); // Trims whitespace like Mongoose trim: true
        },
        validate: {
            notEmpty: { msg: 'Please provide a title' }, // Ensures title is not empty
            len: [1, 100] // Enforces length between 1 and 100 characters
        }
    },
    content: {
        type: DataTypes.TEXT, // Suitable for longer content
        allowNull: false,
        set(value) {
            this.setDataValue('content', value.trim()); // Trims whitespace like Mongoose trim: true
        },
        validate: {
            notEmpty: { msg: 'Please provide content' } // Ensures content is not empty
        }
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // References the 'users' table
            key: 'id' // References the 'id' column in the 'users' table
        }
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'blogs' // Specifies the table name in PostgreSQL
});

// Remove the association definition from here for now
// Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = Blog;