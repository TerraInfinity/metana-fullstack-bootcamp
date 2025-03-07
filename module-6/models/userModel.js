/**
 * userModel.js
 * 
 * This file defines the User model for the application using Sequelize.
 * It includes methods for password matching and hooks for password hashing
 * before creating or updating a user.
 * 
 * @class User
 * @extends Model
 * @method matchPassword(enteredPassword) Compares the entered password with the hashed password.
 * @returns {Promise<boolean>} Returns true if the passwords match, otherwise false.
 */
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');
const Blog = require('./blogModel'); // Ensure Blog is imported

class User extends Model {
    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
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
            len: [1, 50]
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'Please provide an email' },
            isEmail: { msg: 'Please provide a valid email' }
        },
        indexes: [{ unique: true }]
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please add a password' },
            len: [6, Infinity]
        },
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
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
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async(user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// Define associations after both models are defined
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = User;