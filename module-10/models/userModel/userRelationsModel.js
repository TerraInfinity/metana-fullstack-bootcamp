/**
 * @file User relations model for managing relationships between users, such as followers and friends.
 * @module models/userModel/userRelationsModel
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../coreUserModel');

/**
 * Represents the UserRelations model, which defines the relationships between users.
 * @extends Model
 */
class UserRelations extends Model {}

/**
 * Initializes the UserRelations model with its attributes and configurations.
 * @static
 */
UserRelations.init({
    /**
     * The unique identifier of the user.
     * @type {UUID}
     * @required
     */
    userId: { type: DataTypes.UUID, allowNull: false },

    /**
     * The unique identifier of the related user.
     * @type {UUID}
     * @required
     */
    relatedUserId: { type: DataTypes.UUID, allowNull: false },

    /**
     * The type of relationship between the users.
     * @type {String}
     * @required
     * @enum {String} - Can be either 'follower' or 'friend'.
     */
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

// Exporting the UserRelations model for use in other parts of the application.
module.exports = UserRelations;