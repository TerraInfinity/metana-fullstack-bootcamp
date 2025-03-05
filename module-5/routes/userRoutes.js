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
        const users = await User.find({}).select('-password');
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
        const users = await User.find({}).select('-password');

        const usersWithBlogs = await Promise.all(users.map(async(user) => {
            const blogs = await Blog.find({ author: user._id })
                .select('title content createdAt')
                .sort({ createdAt: -1 });

            return {
                ...user.toObject(),
                blogs: blogs
            };
        }));

        res.json(usersWithBlogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/register', async(req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            isAdmin
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
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

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
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
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
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
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                token: generateToken(updatedUser._id)
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
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deletion of admin accounts
        if (userToDelete.isAdmin) {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted' });
        }

        // Call the blog route to delete all blogs for this user
        const blogDeleteResponse = await fetch(`${req.protocol}://${req.get('host')}/api/blogs/delete-all/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': req.headers.authorization, // Pass the same authorization token
            },
        });

        const blogDeleteData = await blogDeleteResponse.json();

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: 'User and associated blogs deleted successfully',
            deletedBlogsCount: blogDeleteData.deletedCount
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
        // Delete all users where `isAdmin` is false or not set
        const userResult = await User.deleteMany({
            $or: [
                { isAdmin: false },
                { isAdmin: { $exists: false } }
            ]
        });

        // Call the blog route to delete all blogs
        const blogDeleteResponse = await fetch(`${req.protocol}://${req.get('host')}/api/blogs/delete-all`, {
            method: 'DELETE',
            headers: {
                'Authorization': req.headers.authorization, // Pass the same authorization token
            },
        });

        const blogDeleteData = await blogDeleteResponse.json();

        res.json({
            message: 'All non-admin users and blogs have been deleted',
            deletedUsersCount: userResult.deletedCount,
            deletedBlogsCount: blogDeleteData.deletedCount,
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
        // Delete all blogs
        const blogResult = await Blog.deleteMany({});

        // Delete all users, including admins
        const userResult = await User.deleteMany({});

        // Set the status code explicitly to 200
        res.status(200).json({
            message: 'Factory reset completed. All data has been deleted.',
            deletedUsersCount: userResult.deletedCount,
            deletedBlogsCount: blogResult.deletedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during factory reset' });
    }
});


module.exports = router;