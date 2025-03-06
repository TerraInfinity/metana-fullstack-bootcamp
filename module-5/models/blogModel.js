/**
 * @fileoverview Blog model schema definition for the blog application
 * @module models/blogModel
 */

const mongoose = require('mongoose');

/**
 * Blog Schema
 * @typedef {Object} BlogSchema
 * @property {string} title - The title of the blog post (required, max 100 chars)
 * @property {string} content - The content of the blog post (required)
 * @property {mongoose.Schema.Types.ObjectId} author - Reference to the User who created the post
 * @property {Date} createdAt - Timestamp when the blog was created (auto-generated)
 * @property {Date} updatedAt - Timestamp when the blog was last updated (auto-generated)
 */
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);