/**
 * @file userRoutes.js
 * @module userRoutes
 * @description This module defines the routes for user management, including user registration, login, profile management, deletion, and OAuth authentication. 
 * It utilizes Express for routing and Sequelize for database interactions.
 * @requires express - The Express framework for building web applications.
 * @requires ../../models/coreUserModel - The user model for database interactions.
 * @requires ../../utils/generateToken - Utility for generating JWT tokens for user authentication.
 * @requires ../../middleware/authMiddleware - Middleware for protecting routes and checking user roles.
 * @requires passport - Middleware for handling OAuth authentication.
 * @requires express-rate-limit - Middleware for rate limiting requests to prevent abuse.
 * @requires express-validator - Middleware for validating request data.
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/coreUserModel');
const generateToken = require('../../utils/generateToken');
const { protect, isCreatorOrAdmin, isAdmin } = require('../../middleware/authMiddleware');
const Blog = require('../../models/coreBlogModel');
const bcrypt = require('bcrypt');
const BlogComment = require('../../models/blogModel/blogCommentModel');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Rate limiting for login and register endpoints
/**
 * Rate limiter for login requests.
 * Limits each IP to 100 requests per 15 minutes.
 * @constant {Object} loginLimiter
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

/**
 * Rate limiter for registration requests.
 * Limits each IP to 50 requests per 24 hours.
 * @constant {Object} registerLimiter
 */
const registerLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 50 // limit each IP to 50 requests per windowMs
});

// Request logging middleware
/**
 * Middleware to log incoming requests.
 * Logs the request method and path along with the timestamp.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
// @returns {Array} List of users without passwords.
router.get('/', protect, isAdmin, logRequest, async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Get all users with their blogs
// @route   GET /api/users/with-blogs
// @access  Private (Admin only)
// @returns {Array} List of users along with their associated blogs.
router.get('/with-blogs', protect, isAdmin, logRequest, async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Blog,
                as: 'blogs',
                attributes: ['title', 'content', 'createdAt'],
                order: [
                    ['createdAt', 'DESC']
                ],
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users with blogs:', error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// @returns {Object} Newly created user data along with a JWT token.
router.post(
    '/register',
    registerLimiter,
    logRequest, [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Please provide a valid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password, role } = req.body;

            const userExists = await User.findOne({ where: { email, provider: 'local' } });
            if (userExists) {
                return res.status(409).json({
                    message: 'User already exists with this email',
                    email: email
                });
            }

            const user = await User.create({
                name,
                email,
                password, // Hashed by hook
                provider: 'local',
                role: role || 'user',
            });

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
                createdAt: user.createdAt
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// @returns {Object} User data along with a JWT token.
router.post(
    '/login',
    loginLimiter,
    logRequest, [
        check('email').isEmail().withMessage('Please provide a valid email'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                where: { email, provider: 'local' },
                attributes: ['id', 'name', 'email', 'password', 'role'],
            });

            if (!user) {
                return res.status(401).json({
                    message: 'Invalid email or password',
                    error: 'Invalid credentials'
                });
            }

            const isPasswordValid = await user.matchPassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: 'Invalid email or password',
                    error: 'Invalid credentials'
                });
            }

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
                lastLogin: new Date()
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// @returns {Object} User profile data.
router.get('/profile', protect, async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'bio', 'age', 'gender', 'orientation', 'pronouns', 'socialLinks', 'provider', 'role'],
        });
        if (user) {
            res.json(user); // Includes 'role' field
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user profile by id
// @route   GET /api/users/profile/:id
// @access  Public
// @returns {Object} User profile data along with their blogs and comments.
router.get('/profile/:id', logRequest, async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email'],
            include: [{
                model: Blog,
                as: 'blogs',
                attributes: ['id', 'title', 'content', 'createdAt']
            }, {
                model: BlogComment,
                as: 'comments',
                attributes: ['id', 'userId', 'content', 'blogId', 'rating', 'createdAt']
            }]
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Update user profile (including optional password change)
// @route   PUT /api/users/profile
// @access  Private
// @returns {Object} Updated user profile data.
router.put(
    '/profile',
    protect,
    logRequest, [
        check('name').optional().isString().withMessage('Name must be a string'),
        check('email').optional().isEmail().withMessage('Please provide a valid email'),
        check('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        check('currentPassword').optional().notEmpty().withMessage('Current password is required when updating password'),
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Validation Error',
                    errors: errors.array()
                });
            }

            const { name, email, password, currentPassword, bio, socialLinks, age, gender, orientation, pronouns } = req.body;
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('User password from DB:', user.password); // Log current hash
            console.log('Received currentPassword:', currentPassword); // Log received current password
            console.log('Received new password:', password); // Log received new password
            console.log('Received profile update data:', JSON.stringify({
                name,
                email,
                bio,
                socialLinks,
                age,
                gender,
                orientation,
                pronouns
            }, null, 2));

            if (user.provider !== 'local') {
                if (email || password) {
                    return res.status(403).json({
                        message: `Cannot update email or password for ${user.provider} users.`,
                        error: 'Provider restriction'
                    });
                }
            }

            // Update basic profile fields (consistent checking)
            if (name !== undefined) user.name = name;

            // Update profile fields (checking for existence in request body)
            if ('bio' in req.body) user.bio = bio;
            if ('socialLinks' in req.body) user.socialLinks = socialLinks || {};

            // Ensure these fields are treated as strings
            if ('age' in req.body) user.age = age === null ? null : String(age);
            if ('gender' in req.body) user.gender = gender === null ? null : String(gender);
            if ('orientation' in req.body) user.orientation = orientation === null ? null : String(orientation);
            if ('pronouns' in req.body) user.pronouns = pronouns === null ? null : String(pronouns);

            if (user.provider === 'local') {
                if (email && email !== user.email) {
                    const existingUser = await User.findOne({ where: { email, provider: 'local' } });
                    if (existingUser) {
                        return res.status(409).json({ message: 'Email already exists' });
                    }
                    user.email = email;
                }
                if (password) {
                    if (!currentPassword) {
                        return res.status(400).json({ message: 'Current password is required to update password' });
                    }
                    const isMatch = await user.matchPassword(currentPassword);
                    if (!isMatch) {
                        return res.status(401).json({ message: 'Current password is incorrect' });
                    }
                    user.password = password; // Should be hashed by beforeUpdate hook
                    console.log('New password set (pre-hash):', password); // Log pre-hash value
                }
            }

            await user.save();
            console.log('New password hashed for user:', req.user.id); // Log after save
            console.log('Updated user password in DB:', user.password); // Log new hash

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                socialLinks: user.socialLinks,
                age: user.age,
                gender: user.gender,
                orientation: user.orientation,
                pronouns: user.pronouns,
                role: user.role,
                provider: user.provider,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Delete a specific user and their blogs
// @route   DELETE /api/users/delete/:id
// @access  Private (Admin only)
// @returns {Object} Confirmation message and details of deleted blogs.
router.delete('/delete/:id', protect, isAdmin, logRequest, async(req, res) => {
    try {
        const userToDelete = await User.findByPk(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: Prevent deletion of admin accounts
        if (userToDelete.role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted' });
        }

        // Find blogs for logging purposes
        const deletedBlogs = await Blog.findAll({
            where: { authorId: userToDelete.id },
        });

        // Delete all blogs by this user
        const deletedBlogsCount = await Blog.destroy({
            where: { authorId: userToDelete.id },
        });

        // Delete the user
        await userToDelete.destroy();

        res.json({
            message: 'User and associated blogs deleted successfully',
            deletedBlogsCount,
            deletedBlogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

// @desc    Delete all users (except admins) and all blogs
// @route   DELETE /api/users/delete-all
// @access  Private (Admin only)
// @returns {Object} Confirmation message and counts of deleted users and blogs.
router.delete('/delete-all', protect, isAdmin, logRequest, async(req, res) => {
    try {
        const deletedUsers = await User.findAll({
            where: {
                role: {
                    [Op.ne]: 'admin'
                }
            }
        });

        const deletedUsersCount = await User.destroy({
            where: {
                role: {
                    [Op.ne]: 'admin'
                }
            }
        });

        const deletedBlogsCount = await Blog.destroy({ where: {} });

        res.json({
            message: 'All non-admin users and blogs have been deleted',
            deletedUsersCount,
            deletedBlogsCount,
            deletedUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Factory reset - delete all data
// @route   DELETE /api/factory-reset
// @access  Private (Admin only)
// @returns {Object} Confirmation message and counts of deleted users and blogs.
router.delete('/factory-reset', protect, isAdmin, logRequest, async(req, res) => {
    try {
        const deletedBlogsCount = await Blog.destroy({ where: {} });
        const deletedUsersCount = await User.destroy({ where: {} });

        res.status(200).json({
            message: 'Factory reset completed. All data has been deleted.',
            deletedUsersCount,
            deletedBlogsCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error during factory reset',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Temporary endpoint to hash existing passwords
// @route   POST /api/users/hash-passwords
// @access  Public (temporary)
// @returns {Object} Confirmation message after hashing passwords.
router.post('/hash-passwords', logRequest, async(req, res) => {
    try {
        const users = await User.findAll();
        for (const user of users) {
            if (user.password) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
                await user.save();
            }
        }
        res.status(200).json({ message: 'All passwords have been hashed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// OAuth Routes
// @desc    Authenticate with Google
// @route   GET /api/users/auth/google
// @access  Public
// @returns {Object} Redirects to Google for authentication.
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google OAuth callback
// @route   GET /api/users/auth/google/callback
// @access  Public
// @returns {Object} Redirects to frontend with JWT token after successful authentication.
router.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async(req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            const token = generateToken(req.user.id, user.role || 'user');
            console.log('Google OAuth - User:', {
                id: req.user.id,
                role: user.role,
                provider: 'google'
            }, 'Token:', token);
            res.redirect(`${process.env.REACT_APP_FRONTEND_ORIGIN}:${process.env.REACT_APP_FRONTEND_PORT}/auth/callback?token=${token}`);
        } catch (error) {
            console.error('Error in Google OAuth callback:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Authenticate with GitHub
// @route   GET /api/users/auth/github
// @access  Public
// @returns {Object} Redirects to GitHub for authentication.
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// @desc    GitHub OAuth callback
// @route   GET /api/users/auth/github/callback
// @access  Public
// @returns {Object} Redirects to frontend with JWT token after successful authentication.
router.get('/auth/github/callback',
    passport.authenticate('github', { session: false }),
    async(req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            const token = generateToken(req.user.id, user.role || 'user');
            console.log('GitHub OAuth - User:', {
                id: req.user.id,
                role: user.role,
                provider: 'github'
            }, 'Token:', token);
            res.redirect(`${process.env.REACT_APP_FRONTEND_ORIGIN}:${process.env.REACT_APP_FRONTEND_PORT}/auth/callback?token=${token}`);
        } catch (error) {
            console.error('Error in GitHub OAuth callback:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Authenticate with Twitter (X.com)
// @route   GET /api/users/auth/twitter
// @access  Public
// @returns {Object} Redirects to Twitter for authentication.
router.get('/auth/twitter', passport.authenticate('twitter', { scope: ['tweet.read', 'users.read'] }));

// @desc    Twitter OAuth callback
// @route   GET /api/users/auth/twitter/callback
// @access  Public
// @returns {Object} Redirects to frontend with JWT token after successful authentication.
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    async(req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            const token = generateToken(req.user.id, user.role || 'user');
            console.log('Twitter OAuth - User:', {
                id: req.user.id,
                role: user.role,
                provider: 'twitter'
            }, 'Token:', token);
            res.redirect(`${process.env.REACT_APP_FRONTEND_ORIGIN}:${process.env.REACT_APP_FRONTEND_PORT}/auth/callback?token=${token}`);
        } catch (error) {
            console.error('Error in Twitter OAuth callback:', error);
            res.status(500).json({
                message: 'Server Error',
                error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// @desc    Get user role
// @route   GET /api/users/role
// @access  Private
// @returns {Object} User role data.
router.get('/role', protect, async(req, res) => {
    console.log('Received request to get user role'); // Log the request
    const userId = req.user.id; // Use the current user's ID
    console.log('User ID:', userId); // Log the user ID

    try {
        const user = await User.findByPk(userId, {
            attributes: ['role'], // Only fetch the role
        });

        if (user) {
            console.log('User found:', user); // Log the found user
            res.json({ role: user.role });
        } else {
            console.log('User not found'); // Log if user is not found
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user role:', error); // Log the error
        res.status(500).json({
            message: 'Server Error',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;