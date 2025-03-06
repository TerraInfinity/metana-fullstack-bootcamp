/**
 * @file Blog routes handling all blog-related API endpoints
 * @module blogRoutes
 * @requires express
 * @requires ../models/blogModel
 * @requires ../models/userModel
 * @requires ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @route POST /api/blogs/create
 * @desc Create a new blog post
 * @access Private - Requires authentication
 * @param {Object} req.body.title - The title of the blog post
 * @param {Object} req.body.content - The content of the blog post
 * @returns {Object} Created blog post
 */
router.post('/create', protect, async(req, res) => {
    try {
        const { title, content } = req.body;

        // Create new blog
        const blog = await Blog.create({
            title,
            content,
            author: req.user._id
        });

        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route GET /api/blogs
 * @desc Get all blog posts
 * @access Public
 * @returns {Array} Array of blog posts
 */
router.get('/', async(req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route GET /api/blogs/:id
 * @desc Get a single blog post by ID
 * @access Public
 * @param {string} req.params.id - Blog post ID
 * @returns {Object} Blog post
 */
router.get('/:id', async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            'author',
            'name email'
        );

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route PUT /api/blogs/update/:id
 * @desc Update a blog post
 * @access Private - Only author can update
 * @param {string} req.params.id - Blog post ID
 * @param {Object} req.body.title - Updated title
 * @param {Object} req.body.content - Updated content
 * @returns {Object} Updated blog post
 */
router.put('/update/:id', protect, async(req, res) => {
    try {
        const { title, content } = req.body;

        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update blog
        blog = await Blog.findByIdAndUpdate(
            req.params.id, { title, content }, { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.json(blog);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route DELETE /api/blogs/delete/:id
 * @desc Delete a blog post
 * @access Private - Author or Admin only
 * @param {string} req.params.id - Blog post ID
 * @returns {Object} Success message
 */
router.delete('/delete/:id', protect, async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author of the blog or an admin
        if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route DELETE /api/blogs/delete-all
 * @desc Delete all blog posts
 * @access Private - Admin only
 * @returns {Object} Success message with delete count
 */
router.delete('/delete-all', protect, admin, async(req, res) => {
    try {
        const result = await Blog.deleteMany({});

        res.json({
            message: 'All blogs have been deleted',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route DELETE /api/blogs/delete-all/:id
 * @desc Delete all blog posts for a specific user
 * @access Private - Admin only
 * @param {string} req.params.id - User ID
 * @returns {Object} Success message with delete count
 */
router.delete('/delete-all/:id', protect, admin, async(req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all blogs for the specific user
        const result = await Blog.deleteMany({ author: userId });

        res.json({
            message: `All blogs for user ${userId} have been deleted`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;