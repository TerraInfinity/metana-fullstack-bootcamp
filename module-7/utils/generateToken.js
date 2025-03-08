const jwt = require('jsonwebtoken');

/**
 * @file generateToken.js
 * Generates a JSON Web Token (JWT) for a given user ID.
 *
 * @param {string} id - The user ID to include in the token payload.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = generateToken;