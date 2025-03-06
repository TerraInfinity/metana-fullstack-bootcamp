/**
 * @file db.js
 * @description Database configuration file for MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB using the MONGODB_URI environment variable
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails, exits process with status code 1
 */
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;