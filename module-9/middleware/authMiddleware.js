/**
 * authMiddleware.js
 * Middleware for protecting routes and enforcing role-based access control (RBAC).
 * 
 * This module exports three middleware functions:
 * - protect: Middleware that verifies the JSON Web Token (JWT) and ensures the user exists in the database.
 * - isAdmin: Middleware that checks if the authenticated user has admin privileges.
 * - isCreatorOrAdmin: Middleware that checks if the authenticated user is either a creator or an admin.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/coreUserModel');

// Protect routes by verifying JWT and ensuring the user exists
const protect = async(req, res, next) => {
    let token;

    // Check if token exists in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Validate that decoded.id is a valid UUID
            if (!decoded.id || typeof decoded.id !== 'string') {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            // Retrieve user from the database using Sequelize
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] },
            });

            // Check if the user exists in the database
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided, respond with an unauthorized status
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Check if the authenticated user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Proceed if the user is an admin
    } else {
        res.status(403).json({ message: 'Access denied: Admin only' }); // Deny access if not an admin
    }
};

// Check if the authenticated user is a creator or an admin
const isCreatorOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'creator' || req.user.role === 'admin')) {
        next(); // Proceed if the user is a creator or admin
    } else {
        res.status(403).json({ message: 'Access denied: Creator or Admin only' }); // Deny access if not authorized
    }
};

module.exports = { protect, isAdmin, isCreatorOrAdmin };