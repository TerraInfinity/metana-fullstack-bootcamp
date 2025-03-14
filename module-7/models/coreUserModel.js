/**
 * @fileoverview User model schema definition for the blog application using Sequelize for PostgreSQL.
 * @module models/coreUserModel
 * /**
 * coreUserModel.js
 * 
 * This file defines the User model for the application using Sequelize.
 * It includes methods for password matching and hooks for password hashing
 * before creating or updating a user.
 * 
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

class User extends Model {
    async matchPassword(enteredPassword) {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log(`Comparing entered password: ${enteredPassword} with stored password: ${this.password} - Match: ${isMatch}`);
        return isMatch;
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        set(value) {
            this.setDataValue('name', value.trim());
        },
        validate: {
            notEmpty: { msg: 'Please provide a name' },
            len: [1, 50],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'Please provide an email' },
            isEmail: { msg: 'Please provide a valid email' },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please add a password' },
            len: [6, Infinity],
        },
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    xp: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    orientation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pronouns: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    hooks: {
        beforeCreate: async(user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async(user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

// Define associations after model initialization
const Blog = require('./coreBlogModel');
const BlogComment = require('./blogModel/blogCommentModel');

User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(BlogComment, { foreignKey: 'userId', as: 'comments' });
BlogComment.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;