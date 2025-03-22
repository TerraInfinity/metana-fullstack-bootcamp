/**
 * @fileoverview Core User model schema definition for the blog application using Sequelize for PostgreSQL.
 * This file defines the User model schema, including fields and validation rules, as well as methods for password handling.
 * 
 * coreUserModel.js
 * 
 * This file defines the User model for the application using Sequelize. It includes methods for password matching,
 * hooks for password hashing before creating or updating a user, and associations with other models.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Represents a User in the application.
 * @class User
 * @extends Model
 * @description This class encapsulates the user data and behavior, including password management and user roles.
 */
class User extends Model {
    /**
     * Checks if the entered password matches the stored password.
     * @async
     * @param {string} enteredPassword - The password to compare with the stored password.
     * @returns {Promise<boolean>} True if the passwords match, false otherwise.
     * @throws {Error} Throws an error if the password comparison fails.
     */
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
        allowNull: true,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local',
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('user', 'editor', 'creator', 'admin'),
        allowNull: false,
        defaultValue: 'user',
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
        type: DataTypes.STRING,
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
    socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
        /**
         * Hashes the password before creating a new user.
         * @async
         * @param {User} user - The user instance for which the password needs to be hashed.
         * @description This hook is triggered before a user is created. It hashes the password if the provider is 'local'.
         */
        beforeCreate: async(user) => {
            if (user.provider === 'local' && user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        /**
         * Hashes the password before updating an existing user.
         * @async
         * @param {User} user - The user instance for which the password needs to be hashed.
         * @description This hook is triggered before a user is updated. It hashes the password if it has been changed and the provider is 'local'.
         */
        beforeUpdate: async(user) => {
            console.log('beforeUpdate triggered, password changed:', user.changed('password'));
            if (user.provider === 'local' && user.changed('password')) {
                console.log('Hashing password:', user.password);
                user.password = await bcrypt.hash(user.password, 10);
                console.log('Hashed password:', user.password);
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