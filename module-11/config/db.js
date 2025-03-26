/**
 * @file db.js
 * @description This file configures the connection to a PostgreSQL database using Sequelize ORM.
 * It exports the Sequelize instance and a function to establish the database connection.
 */

require('dotenv').config(); // Load environment variables from the .env file for configuration

const { Sequelize } = require('sequelize');

/**
 * Sequelize instance for connecting to PostgreSQL
 * @type {Sequelize}
 * @see https://sequelize.org/master/manual/getting-started.html for Sequelize documentation
 */
const sequelize = new Sequelize(
    process.env.POSTGRESQL_URI || 'postgresql://postgres:nxBcUE3vBmhPGQEN@nimbly-calming-starfish.data-1.use1.tembo.io:5432/postgres', {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // Enable SSL connection
                rejectUnauthorized: false // Disable certificate validation for self-signed certificates
            }
        },
        logging: false // Set to true to enable logging of SQL queries for debugging
    }
);

if (!process.env.POSTGRESQL_URI) {
    console.warn('Warning: POSTGRESQL_URI environment variable is not set. Using fallback URI for connection.');
}

/**
 * Establishes and tests the connection to the PostgreSQL database.
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves if the connection is successful, rejects with an error if it fails.
 * @throws {Error} If the connection fails, the process exits with status code 1.
 */
const connectDB = async() => {
    try {
        await sequelize.authenticate(); // Test the connection to the database
        console.log('PostgreSQL Connected successfully');
        // Optionally sync models with the database (creates tables if they don't exist)
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables (use with caution in production)
    } catch (error) {
        console.error(`Connection Error: ${error.message}`); // Log the error message
        process.exit(1); // Exit the process with an error status
    }
};

module.exports = { sequelize, connectDB }; // Export the Sequelize instance and connectDB function