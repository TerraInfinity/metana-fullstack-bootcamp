const express = require('express');
const router = express.Router();
const PointTypes = require('../../../models/common/pointTypesModel');
const { protect, isCreatorOrAdmin, isAdmin } = require('../../../middleware/authMiddleware');

/**
 * @route POST /
 * @group PointTypes - Operations about point types
 * @param {string} name.body.required - The name of the point type
 * @returns {object} 201 - The created point type
 * @returns {Error}  400 - Name is required
 * @returns {Error}  500 - Internal server error
 */
router.post('/', protect, isAdmin, async(req, res) => {
    try {
        const { name } = req.body; // Expecting a name in the request body

        // Validate input
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        console.log(`Creating point type with name: ${name}`); // Log the name being created

        // Create a new point type
        const newPointType = await PointTypes.create({ name, description });

        return res.status(201).json(newPointType); // Respond with the created point type
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @route GET /
 * @group PointTypes - Operations about point types
 * @returns {Array.<object>} 200 - An array of point types
 * @returns {Error}  500 - Internal server error
 */
router.get('/', async(req, res) => {
    try {
        console.log('Fetching all point types'); // Log fetching action
        const pointTypes = await PointTypes.findAll();
        console.log('Fetched point types:', pointTypes); // Log the fetched point types
        return res.status(200).json(pointTypes); // Respond with the list of point types
    } catch (error) {
        console.error('Error fetching point types:', error); // Log error details
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @route PUT /:id
 * @group PointTypes - Operations about point types
 * @param {string} id.path.required - The ID of the point type
 * @param {string} name.body.required - The new name of the point type
 * @param {string} description.body - The new description of the point type
 * @returns {object} 200 - The updated point type
 * @returns {Error}  400 - Name is required
 * @returns {Error}  404 - Point type not found
 * @returns {Error}  500 - Internal server error
 */
router.put('/:id', protect, isAdmin, async(req, res) => {
    try {
        const { id } = req.params; // Get the point type ID from the URL
        const { name } = req.body; // Expecting a name in the request body
        const { description } = req.body; // Expecting a name in the request body


        // Validate input
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        console.log(`Updating point type with ID: ${id} to name: ${name}`); // Log update action

        const updatedPointType = await PointTypes.findByPk(id);
        if (!updatedPointType) {
            return res.status(404).json({ message: 'Point type not found' });
        }

        updatedPointType.name = name;
        updatedPointType.description = description;
        await updatedPointType.save();

        return res.status(200).json(updatedPointType); // Respond with the updated point type
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @route DELETE /:id
 * @group PointTypes - Operations about point types
 * @param {string} id.path.required - The ID of the point type
 * @returns {204} 204 - No content
 * @returns {Error}  404 - Point type not found
 * @returns {Error}  500 - Internal server error
 */
router.delete('/:id', protect, isAdmin, async(req, res) => {
    try {
        const { id } = req.params; // Get the point type ID from the URL
        console.log(`Deleting point type with ID: ${id}`); // Log delete action
        const deletedPointType = await PointTypes.findByPk(id);
        if (!deletedPointType) {
            return res.status(404).json({ message: 'Point type not found' });
        }

        await deletedPointType.destroy();
        return res.status(204).send(); // Respond with no content
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @route DELETE /
 * @group PointTypes - Operations about point types
 * @returns {object} 200 - A message and count of deleted point types
 * @returns {Error}  500 - Internal server error
 */
router.delete('/', protect, isAdmin, async(req, res) => {
    try {
        console.log('Deleting all point types'); // Log delete all action
        const deletedPointTypesCount = await PointTypes.destroy({ where: {} }); // Delete all paths
        return res.status(200).json({ // Respond with a message and count of deleted point types
            message: 'Deleted all point types.',
            deletedPointTypesCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;