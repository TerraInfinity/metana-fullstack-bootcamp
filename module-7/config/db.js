/**
 * @file db.js
 * @description Database configuration file for PostgreSQL connection using Sequelize.
 * This file exports the Sequelize instance and the connectDB function.
 */

require('dotenv').config(); // Load environment variables from .env file

const { Sequelize } = require('sequelize');

/**
 * Sequelize instance for PostgreSQL connection
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
    process.env.POSTGRESQL_URI || 'postgresql://postgres:nxBcUE3vBmhPGQEN@nimbly-calming-starfish.data-1.use1.tembo.io:5432/postgres', {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Disable certificate validation
            }
        },
        logging: false // Set to true to log SQL queries
    }
);

if (!process.env.POSTGRESQL_URI) {
    console.warn('Warning: POSTGRESQL_URI not set, using fallback URI');
}

/**
 * Establishes and tests connection to PostgreSQL
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails, exits process with status code 1
 */
const connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected');
        // Optionally sync models with database (creates tables if they don't exist)
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables (careful in production!)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };