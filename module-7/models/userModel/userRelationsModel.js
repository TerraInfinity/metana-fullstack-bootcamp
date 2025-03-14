/**
 * @file User relations model for followers and friends.
 * @module models/userModel/userRelationsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

class UserRelations extends Model {}

UserRelations.init({
    userId: { type: DataTypes.UUID, allowNull: false },
    relatedUserId: { type: DataTypes.UUID, allowNull: false },
    relationType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [
                ['follower', 'friend']
            ]
        }
    }
}, {
    sequelize,
    modelName: 'UserRelations',
    tableName: 'user_relations',
    timestamps: true,
    indexes: [{ fields: ['userId', 'relatedUserId'], unique: true }]
});

module.exports = UserRelations;