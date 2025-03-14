/**
 * @file Comment routes handling all comment-related API endpoints
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
const { protect } = require('../../middleware/authMiddleware');

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
 * @desc Get a single comment by ID
 * @access Public
 * @param {string} req.params.id - Comment ID
 * @returns {Object} Comment
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
 * @desc Update a comment
 * @access Private - Requires authentication
 * @param {string} req.params.id - Comment ID
 * @param {Object} req.body - Updated comment data
 * @returns {Object} Updated comment
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
 * @desc Delete a comment
 * @access Private - Requires authentication
 * @param {string} req.params.id - Comment ID
 * @returns {Object} Success message
 */
router.delete('/delete/:id', protect, async(req, res) => {
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