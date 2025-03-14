const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const PointTypes = require('./pointTypesModel');
const Achievements = require('./achievementsModel');

const Paths = sequelize.define('Paths', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    perks: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false

    }
}, {
    timestamps: false
});

// Association with PointTypes
Paths.belongsTo(PointTypes, { foreignKey: 'pointTypeId' });

// Association with Achievements
Paths.hasMany(Achievements, { foreignKey: 'pathId' });

module.exports = Paths;