/**
 * @file Blog comment model for managing comments associated with blog posts.
 * @module models/blogModel/blogCommentModel
 * 
 * This model represents a comment made by a user on a blog post, including
 * the content of the comment, a rating, and a timestamp for when the comment
 * was created. It also establishes relationships with the User and Blog models.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogComment extends Model {}

/**
 * Initializes the BlogComment model with its attributes and validation rules.
 */
BlogComment.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
        // Foreign key referencing the associated blog post
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // This should match the table name of the User model
            key: 'id',
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value) {
            this.setDataValue('content', value.trim()); // Trims whitespace from content
        },
        validate: {
            notEmpty: { msg: 'Please provide comment content' }, // Validation message for empty content
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1, // Minimum rating value
            max: 5, // Maximum rating value
        },
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Sets the default timestamp to the current date and time
    },
}, {
    sequelize,
    modelName: 'BlogComment',
    tableName: 'blog_comments',
    timestamps: true, // Enables createdAt and updatedAt fields
});

// Move associations to a separate function or define them after model initialization
module.exports = BlogComment;