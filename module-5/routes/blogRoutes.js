const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
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

// @desc    Delete a blog
// @route   DELETE /api/blogs/delete/:id
// @access  Private (Author or Admin)
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



// @desc    Delete all blogs
// @route   DELETE /api/blogs/delete-all
// @access  Private (Admin only)
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


// @desc    Delete all blogs for a specific user
// @route   DELETE /api/blogs/delete-all/:id
// @access  Private (Admin only)
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