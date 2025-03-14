const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Achievements = sequelize.define('Achievements', {
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
        type: DataTypes.TEXT
    },
    perkLevelingModifier: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    pathId: {
        type: DataTypes.UUID,
        references: {
            model: 'Paths',
            key: 'id'
        }
    }
}, {
    timestamps: false
});

module.exports = Achievements;