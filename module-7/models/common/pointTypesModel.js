const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const PointTypes = sequelize.define('PointTypes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false

    }

}, {
    timestamps: false
});

module.exports = PointTypes;