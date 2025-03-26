/**
 * @file Blog routes handling all blog-related API endpoints.
 * This file defines the routes for managing blog-related operations, including CRUD operations.
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
const { protect, isAdmin, isCreatorOrAdmin } = require('../../middleware/authMiddleware');
const { Sequelize, SequelizeDatabaseError } = require('sequelize');
const BlogComment = require('../../models/blogModel/blogCommentModel');
const Path = require('../../models/common/pathsModel');
const PointTypes = require('../../models/common/pointTypesModel');
var unirest = require('unirest');

/**
 * @route POST /api/blogs/create
 * @desc Create new blog posts. This endpoint allows users to create one or multiple blog posts.
 * @access Private - Requires authentication.
 * @param {Object|Array} req.body - A single blog object or an array of blog objects to create.
 * Each blog object should contain the necessary fields such as title, content, and author information.
 * @returns {Array|Object} Created blog posts, either as an array or a single object based on input.
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
 * @desc Retrieve all blog posts. This endpoint fetches all blog posts along with their associated authors,
 * paths, and comments, ordered by creation date.
 * @access Public
 * @returns {Array} An array of blog posts, each including details about the author and comments.
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
 * @desc Retrieve a single blog post by its ID. This endpoint returns the blog post along with its author,
 * associated path, and comments.
 * @access Public
 * @param {string} req.params.id - The ID of the blog post to retrieve.
 * @returns {Object} The blog post object, including details about the author and comments, or a 404 error if not found.
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
 * @desc Update an existing blog post. This endpoint allows the author of the blog to update its title,
 * summary, content, audio URL, and video URL.
 * @access Private - Only the author can update their blog post.
 * @param {string} req.params.id - The ID of the blog post to update.
 * @param {Object} req.body - The updated blog data, including title, blogSummary, content, audioUrl, and videoUrl.
 * @returns {Object} The updated blog post object.
 */
router.put('/update/:id', protect, async(req, res) => {
    const { title, blogSummary, content, audioUrl, videoUrl } = req.body;

    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.authorId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await blog.update({ title, blogSummary, content, audioUrl, videoUrl });

        const updatedBlog = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['name', 'email']
            }]
        });

        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route DELETE /api/blogs/delete/:id
 * @desc Delete a blog post. This endpoint allows the author or an admin to delete a specific blog post.
 * @access Private - Only the author or an admin can delete the blog post.
 * @param {string} req.params.id - The ID of the blog post to delete.
 * @returns {Object} A success message along with the details of the deleted blog post.
 */
router.delete('/delete/:id', protect, isCreatorOrAdmin, async(req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author of the blog or an admin
        const isOwner = blog.authorId.toString() === req.user.id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!(isOwner || isAdmin)) {
            return res.status(403).json({ message: 'Access denied: You must be the author or an admin' });
        }

        // Capture blog details before deletion
        const deletedBlog = blog.get({ plain: true });

        // Delete the blog
        await Blog.destroy({ where: { id: req.params.id } });

        res.json({ message: 'Blog removed', deletedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting blog post',
            error: process.env.REACT_APP_NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

/**
 * @route DELETE /api/blogs/delete-all
 * @desc Delete all blog posts. This endpoint allows an admin to delete all blog posts in the system.
 * @access Private - Admin only
 * @returns {Object} A success message with the count of deleted blog posts.
 */
router.delete('/delete-all', protect, isAdmin, async(req, res) => {
    try {
        const deletedCount = await Blog.destroy({ where: {} }); // Deletes all blog posts

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
 * @desc Delete all blog posts for a specific user. This endpoint allows an admin to delete all blog posts
 * authored by a specific user.
 * @access Private - Admin only
 * @param {string} req.params.id - The ID of the user whose blog posts are to be deleted.
 * @returns {Object} A success message with the count of deleted blog posts for the specified user.
 */
router.delete('/delete-all/:id', protect, isAdmin, async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId); // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedCount = await Blog.destroy({ // Deletes all blogs for the specified user
            where: { authorId: userId }
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
 * @desc Create a new comment on a blog post. This endpoint allows authenticated users to add comments
 * to a specific blog post.
 * @access Private - Requires authentication.
 * @param {Object} req.body - The comment object to create, including content, blogId, and rating.
 * @returns {Object} The created comment object.
 */
router.post('/create', protect, isCreatorOrAdmin, async(req, res) => {
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