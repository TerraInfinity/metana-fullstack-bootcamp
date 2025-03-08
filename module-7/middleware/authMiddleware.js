/**
 * authMiddleware.js
 * Middleware for protecting routes and checking admin access.
 * Exports:
 * - protect: Middleware to protect routes by verifying JWT.
 * - admin: Middleware to check if the user is an admin.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');

// Protect routes
const protect = async(req, res, next) => {
    let token;

    // Check if token exists in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if decoded.id is a valid UUID
            if (!decoded.id || typeof decoded.id !== 'string') {
                return res.status(401).json({ message: 'Not authorized, invalid token', token });
            }

            // Get user from the token using Sequelize
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] },
            });

            // Check if user exists
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed', token });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// Admin middleware
const admin = async(req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };