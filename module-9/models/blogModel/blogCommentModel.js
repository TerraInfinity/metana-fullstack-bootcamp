/**
 * @file Blog comment model for managing comments with ratings and timestamps.
 * @module models/blogModel/blogCommentModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class BlogComment extends Model {}

BlogComment.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
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
            this.setDataValue('content', value.trim());
        },
        validate: {
            notEmpty: { msg: 'Please provide comment content' },
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'BlogComment',
    tableName: 'blog_comments',
    timestamps: true,
});

// Move associations to a separate function or define them after model initialization
module.exports = BlogComment;