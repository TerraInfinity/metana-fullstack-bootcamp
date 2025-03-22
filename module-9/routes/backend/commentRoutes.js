/**
 * @file Comment routes handling all comment-related API endpoints.
 * This file defines the routes for managing comments, including creating, retrieving, updating, and deleting comments.
 * @module commentRoutes
 * @requires express
 * @requires ../../models/blogModel/blogCommentModel
 * @requires ../../models/coreUserModel
 * @requires ../../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const BlogComment = require('../../models/blogModel/blogCommentModel');
const User = require('../../models/coreUserModel');
const { protect, isAdmin, isCreatorOrAdmin } = require('../../middleware/authMiddleware');

/**
 * @route POST /api/comments/create
 * @desc Create a new comment associated with a blog post.
 * @access Private - Requires authentication to create a comment.
 * @param {Object} req.body - The comment object containing content, blogId, and rating.
 * @returns {Object} Created comment object with details including user information.
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

        const user = await User.findByPk(req.user.id);

        const responseComment = {
            id: newComment.id,
            content: newComment.content,
            blogId: newComment.blogId,
            rating: newComment.rating,
            userId: newComment.userId,
            timestamp: newComment.createdAt,
            User: {
                name: user.name
            }
        };

        res.status(201).json(responseComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
});

/**
 * @route GET /api/comments/:id
 * @desc Retrieve a single comment by its unique ID.
 * @access Public - No authentication required to view comments.
 * @param {string} req.params.id - The unique identifier of the comment to retrieve.
 * @returns {Object} The comment object if found, or an error message if not found.
 */
router.get('/:id', async(req, res) => {
    try {
        const comment = await BlogComment.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name'] }] // Include user who made the comment
        });

        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching comment', error: error.message });
    }
});

/**
 * @route PUT /api/comments/update/:id
 * @desc Update an existing comment by its ID.
 * @access Private - Requires authentication to update a comment.
 * @param {string} req.params.id - The unique identifier of the comment to update.
 * @param {Object} req.body - The updated comment data including content and rating.
 * @returns {Object} The updated comment object.
 */
router.put('/update/:id', protect, async(req, res) => {
    try {
        const { content, rating } = req.body;

        const comment = await BlogComment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this comment' });
        }

        await comment.update({ content, rating });

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
});

/**
 * @route DELETE /api/comments/delete/:id
 * @desc Delete a comment by its unique ID.
 * @access Private - Requires authentication and admin privileges to delete a comment.
 * @param {string} req.params.id - The unique identifier of the comment to delete.
 * @returns {Object} Success message indicating the comment was deleted.
 */
router.delete('/delete/:id', protect, isAdmin, async(req, res) => {
    try {
        const comment = await BlogComment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.destroy();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
});

module.exports = router;