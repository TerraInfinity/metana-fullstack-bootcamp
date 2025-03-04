const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async(req, res) => {
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

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
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

// @desc    Get a single blog
// @route   GET /api/blogs/:id
// @access  Public
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

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, async(req, res) => {
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

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
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

module.exports = router;