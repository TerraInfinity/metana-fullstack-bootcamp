const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Categories = sequelize.define('Categories', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: false
});

module.exports = Categories;