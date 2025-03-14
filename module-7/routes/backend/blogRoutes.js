/**
 * @file Blog routes handling all blog-related API endpoints
 * @module blogRoutes
 * @requires express
 * @requires ../models/coreBlogModel
 * @requires ../models/coreUserModel
 * @requires ../models/coreBlogSummaryModel
 * @requires ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const Blog = require('../../models/coreBlogModel');
const User = require('../../models/coreUserModel');
const { protect, admin } = require('../../middleware/authMiddleware');
const { Sequelize, SequelizeDatabaseError } = require('sequelize');
const BlogComment = require('../../models/blogModel/blogCommentModel');
const Path = require('../../models/common/pathsModel');
const PointTypes = require('../../models/common/pointTypesModel');
var unirest = require('unirest')

/**
 * @route POST /api/blogs/create
 * @desc Create new blog posts
 * @access Private - Requires authentication
 * @param {Object|Array} req.body - A single blog object or an array of blog objects to create
 * @returns {Array|Object} Created blog posts
 */
router.post('/create', protect, async(req, res) => {
    try {
        // Step 1: Check if req.body is an array; if not, wrap it in an array
        const blogsData = Array.isArray(req.body) ? req.body : [req.body]; // Handle single or multiple blogs

        const createdBlogs = []; // Array to hold created blogs

        // Step 2: Iterate over each blogData in blogsData
        for (const blogData of blogsData) {
            const { title, content, blogComments, isAgeRestricted, videoUrl, audioUrl, blogImage, blogSummary, pathId, authorWebsite, authorLogo, featured, disclaimer, easterEgg } = blogData;

            // Step 3: Validate pathId exists in Paths table
            if (pathId) {
                const pathExists = await Path.findByPk(pathId);
                if (!pathExists) {
                    return res.status(400).json({
                        message: 'Invalid pathId provided: ' + pathId
                    });
                }
            }

            // Step 4: Create new blog with authorId instead of author
            const blog = await Blog.create({
                title,
                content,
                authorId: req.user.id,
                isAgeRestricted,
                videoUrl,
                audioUrl,
                blogImage,
                blogSummary,
                pathId,
                authorWebsite,
                authorLogo,
                disclaimer,
                easterEgg,
                featured,
            });

            createdBlogs.push(blog); // Add created blog to the array

            // Step 5: Check if blogComments are provided
            if (blogComments && Array.isArray(blogComments)) {
                for (const comment of blogComments) {
                    if (comment.id) {
                        const existingComment = await BlogComment.findByPk(comment.id);
                        if (!existingComment) {
                            return res.status(404).json({ message: 'Blog comment not found for provided ID' });
                        }
                    } else {
                        await BlogComment.create({
                            userId: req.user.id,
                            content: comment.content,
                            blogId: blog.id,
                            rating: comment.rating

                        });
                    }
                }
            }
        }

        // Step 6: Return all created blogs or a single blog based on the input
        res.status(201).json(createdBlogs.length > 1 ? createdBlogs : createdBlogs[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating blog posts', error: error.message });
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
        const blogs = await Blog.findAll({
            include: [{
                    model: User,
                    as: 'author',
                    attributes: ['name', 'email']
                },
                {
                    model: Path, // Include the Paths model
                    attributes: ['id', 'name'], // Specify the attributes you want to return
                    include: [{
                        model: PointTypes, // Include the PointTypes model
                        attributes: ['id', 'name'] // Specify the attributes you want from PointTypes
                    }]
                },
                {
                    model: BlogComment, // Include the BlogComment model
                    attributes: ['id', 'blogId', 'content', 'userId', 'timestamp', 'rating'], // Specify the attributes you want from BlogComment
                    include: [{ // Include User model to get the name of the user who commented
                        model: User,
                        attributes: ['name'] // Specify the attributes you want from User
                    }]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: [
                'id',
                'authorId',
                'authorName',
                'title',
                'content',
                'isAgeRestricted',
                'videoUrl',
                'audioUrl',
                'authorWebsite',
                'authorLogo',
                'disclaimer',
                'easterEgg',
                'createdAt',
                'updatedAt',
                'blogImage',
                'featured',
                'blogSummary',
                // 'blogLeveling', // Removed
                // 'blogCategories', // Removed if not needed
            ]
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
                },
                {
                    model: Path, // Include the Paths model
                    attributes: ['id', 'name'] // Specify the attributes you want to return
                },
                {
                    model: BlogComment, // Include the BlogComment model
                    attributes: ['id', 'blogId', 'content', 'userId', 'timestamp', 'rating'], // Specify the attributes you want from BlogComment
                    include: [{ // Include User model to get the name of the user who commented
                        model: User,
                        attributes: ['name'] // Specify the attributes you want from User
                    }]
                }
            ]
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

/**
 * @route POST /api/comments/create
 * @desc Create a new comment
 * @access Private - Requires authentication
 * @param {Object} req.body - Comment object to create
 * @returns {Object} Created comment
 */
router.post('/create', protect, async(req, res) => {
    try {
        const { content, blogId, rating } = req.body;

        const newComment = await BlogComment.create({
            userId: req.user.id,
            content,
            blogId,
            rating
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
});

module.exports = router;