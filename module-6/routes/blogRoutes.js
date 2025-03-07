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
const { Sequelize, SequelizeDatabaseError } = require('sequelize');

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

        // Create new blog with authorId instead of author
        const blog = await Blog.create({
            title,
            content,
            authorId: req.user.id // Changed from author: req.user._id
        });

        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating blog post', error: error.message });
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
        const blogs = await Blog.findAll({ // Changed from Blog.find()
            include: [{
                model: User,
                as: 'author',
                attributes: ['name', 'email']
            }],
            order: [
                    ['createdAt', 'DESC']
                ] // Changed from sort()
        });

        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
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
        // Clean the ID by removing backslashes and trimming whitespace
        const id = req.params.id;
        console.log('id', id);
        const blog = await Blog.findByPk(id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['name', 'email']
            }]
        });

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found, id: ' + id });
        }
    } catch (error) {
        console.error(error);
        if (error.original && error.original.code === '22P02') {
            return res.status(400).json({ message: 'Invalid ID format', error: error.message });
        }
        res.status(500).json({ message: 'Error fetching blog post for id: ' + req.params.id, error: error.message });
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

        const blog = await Blog.findByPk(req.params.id); // Changed from findById()
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.authorId !== req.user.id) { // Changed from author.toString()
            return res.status(401).json({ message: 'User not authorized' });
        }

        await blog.update({ title, content }); // Changed from findByIdAndUpdate()

        const updatedBlog = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['name', 'email']
            }]
        });

        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(500).json({ message: 'Error updating blog post', error: error.message });
    }
});

/**
 * @route DELETE /api/blogs/delete/:id
 * @desc Delete a blog post
 * @access Private - Author or Admin only
 * @param {string} req.params.id - Blog post ID
 * @returns {Object} Success message with deleted blog details
 */
router.delete('/delete/:id', protect, async(req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author of the blog or an admin
        if (blog.authorId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        // Return the blog details in the response before deletion
        const deletedBlog = blog.get({ plain: true }); // Get a plain object representation of the blog

        await Blog.destroy({ where: { id: req.params.id } });

        // Return the deleted blog details in the response
        res.json({ message: 'Blog removed', deletedBlog });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(500).json({ message: 'Error deleting blog post', error: error.message });
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
        const deletedCount = await Blog.destroy({ where: {} }); // Changed from deleteMany()

        res.json({
            message: 'All blogs have been deleted',
            deletedCount
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

        const user = await User.findByPk(userId); // Changed from findById()
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedCount = await Blog.destroy({ // Changed from deleteMany()
            where: { authorId: userId } // Changed from author: userId
        });

        res.json({
            message: `All blogs for user ${userId} have been deleted`,
            deletedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;