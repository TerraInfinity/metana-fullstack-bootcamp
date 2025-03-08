const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { protect, admin } = require('../middleware/authMiddleware');
const Blog = require('../models/blogModel');
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all users with their blogs
// @route   GET /api/users/with-blogs
// @access  Private (Admin only)
router.get('/with-blogs', protect, async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Blog,
                as: 'blogs',
                attributes: ['title', 'content', 'createdAt'],
                order: [
                    ['createdAt', 'DESC']
                ]
            }]
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users with blogs:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async(req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            isAdmin
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'password']
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password for ' + email });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email']
        });

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});




// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            await user.update({
                name: req.body.name || user.name,
                email: req.body.email || user.email,
                password: req.body.password ? req.body.password : user.password
            });

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Delete a specific user and their blogs
// @route   DELETE /api/users/delete/:id
// @access  Private (Admin only, cannot delete admin accounts)
router.delete('/delete/:id', protect, admin, async(req, res) => {
    try {
        const userToDelete = await User.findByPk(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToDelete.isAdmin) {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted' });
        }

        // Retrieve the blogs associated with the user before deletion
        const deletedBlogs = await Blog.findAll({
            where: { authorId: userToDelete.id }
        });

        // Delete the blogs associated with the user
        const deletedBlogsCount = await Blog.destroy({
            where: { authorId: userToDelete.id }
        });

        // Delete the user
        await userToDelete.destroy();

        // Return the response with the deleted blogs
        res.json({
            message: 'User and associated blogs deleted successfully',
            deletedBlogsCount,
            deletedBlogs // Include the details of the deleted blogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Delete all users (except admins) and all blogs
// @route   DELETE /api/users/delete-all
// @access  Private (Admin only)
router.delete('/delete-all', protect, admin, async(req, res) => {
    try {
        // Retrieve all non-admin users before deletion
        const deletedUsers = await User.findAll({
            where: { isAdmin: false }
        });

        // Delete all non-admin users
        const deletedUsersCount = await User.destroy({
            where: { isAdmin: false }
        });

        // Delete all blogs
        const deletedBlogsCount = await Blog.destroy({ where: {} });

        // Return the response with the deleted users and blogs count
        res.json({
            message: 'All non-admin users and blogs have been deleted',
            deletedUsersCount,
            deletedBlogsCount, // Include the count of deleted blogs
            deletedUsers // Include the details of the deleted users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Factory reset - delete all data
// @route   DELETE /api/factory-reset
// @access  Private (Admin only)
router.delete('/factory-reset', protect, admin, async(req, res) => {
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
        res.status(500).json({ message: 'Server Error during factory reset' });
    }
});


module.exports = router;