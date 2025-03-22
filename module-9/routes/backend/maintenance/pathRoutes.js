/**
 * @module pathRoutes
 * @description Routes for managing paths, including creation, retrieval, updating, and deletion.
 */

const express = require('express');
const router = express.Router();
const Paths = require('../../../models/common/pathsModel');
const PointTypes = require('../../../models/common/pointTypesModel');
const { protect, isCreatorOrAdmin, isAdmin } = require('../../../middleware/authMiddleware');

// Route to create new paths
/**
 * @route POST /
 * @group Paths - Operations about paths
 * @param {object} pathData.body.required - Path data to create
 * @returns {Array.<object>} 201 - An array of created paths
 * @returns {Error} 400 - Bad request if path data is missing or invalid
 * @returns {Error} 500 - Internal server error
 */
router.post('/', protect, isAdmin, async(req, res) => {
    try {
        let pathsData = req.body; // Expecting either a single path object or an array of path objects

        // Validate input
        if (!pathsData) {
            return res.status(400).json({ message: 'Path data is required' });
        }

        // If it's a single object, wrap it in an array
        if (!Array.isArray(pathsData)) {
            pathsData = [pathsData];
        }

        const createdPaths = [];

        for (const path of pathsData) {
            let pointTypeId;

            // Check if pointTypeId is provided
            if (path.pointTypeId) {
                pointTypeId = path.pointTypeId; // Use provided ID
            } else if (path.pointType && path.pointType.name) {
                // If pointTypeName is provided, look it up
                const existingPointType = await PointTypes.findOne({ where: { name: path.pointType.name } });
                if (existingPointType) {
                    pointTypeId = existingPointType.id; // Use existing point type ID
                } else {
                    // Create new point type if it doesn't exist
                    const newPointType = await PointTypes.create({
                        name: path.pointType.name,
                        description: path.pointType.description // Include description
                    });
                    pointTypeId = newPointType.id; // Use new point type ID
                }
            } else {
                return res.status(400).json({ message: 'Either pointTypeId or pointType.name is required' });
            }

            // Create the path with the pointTypeId
            const newPath = await Paths.create({...path, pointTypeId });

            // Fetch the point type for the created path
            const pointType = await PointTypes.findByPk(pointTypeId);

            // Add the point type to the response in the new format, excluding pointTypeId
            createdPaths.push({
                id: newPath.id, // Include the ID of the new path
                name: newPath.name, // Include the name of the new path
                perks: newPath.perks, // Include any other properties you want
                pointType: { // Updated structure for pointType
                    id: pointType.id,
                    pointType: pointType.name, // Assuming you want to keep the name as pointType
                    description: pointType.description // Include description in the response
                }
                // pointTypeId is not included here
            });
        }

        return res.status(201).json(createdPaths); // Respond with the created paths
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get all paths
/**
 * @route GET /
 * @group Paths - Operations about paths
 * @returns {Array.<object>} 200 - An array of paths
 * @returns {Error} 500 - Internal server error
 */
router.get('/', async(req, res) => {
    try {
        console.log('Fetching all paths'); // Log fetching action
        const paths = await Paths.findAll(); // Fetch all paths
        console.log('Fetched paths:', paths); // Log the fetched paths
        return res.status(200).json(paths); // Respond with the list of paths
    } catch (error) {
        console.error('Error fetching paths:', error); // Log error details
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update a path by ID
/**
 * @route PUT /:id
 * @group Paths - Operations about paths
 * @param {string} id.path.required - ID of the path to update
 * @param {object} pathData.body.required - New path data
 * @returns {object} 200 - The updated path
 * @returns {Error} 400 - Bad request if name is missing
 * @returns {Error} 404 - Path not found
 * @returns {Error} 500 - Internal server error
 */
router.put('/:id', protect, isAdmin, async(req, res) => {
    try {
        const { id } = req.params; // Get the path ID from the URL
        const { name } = req.body; // Expecting a name in the request body

        // Validate input
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        console.log(`Updating path with ID: ${id} to name: ${name}`); // Log update action

        const updatedPath = await Paths.findByIdAndUpdate(id, { name }, { new: true }); // Update the path
        if (!updatedPath) {
            return res.status(404).json({ message: 'Path not found' });
        }

        return res.status(200).json(updatedPath); // Respond with the updated path
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a path by ID
/**
 * @route DELETE /:id
 * @group Paths - Operations about paths
 * @param {string} id.path.required - ID of the path to delete
 * @returns {204} 204 - No content if deletion is successful
 * @returns {Error} 404 - Path not found
 * @returns {Error} 500 - Internal server error
 */
router.delete('/:id', protect, isAdmin, async(req, res) => {
    try {
        const { id } = req.params; // Get the path ID from the URL
        console.log(`Deleting path with ID: ${id}`); // Log delete action
        const deletedPath = await Paths.findByIdAndDelete(id); // Delete the path
        if (!deletedPath) {
            return res.status(404).json({ message: 'Path not found' });
        }

        return res.status(204).send(); // Respond with no content
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete all paths
/**
 * @route DELETE /
 * @group Paths - Operations about paths
 * @returns {object} 200 - Message and count of deleted paths
 * @returns {Error} 500 - Internal server error
 */
router.delete('/', protect, isAdmin, async(req, res) => {
    try {
        console.log('Deleting all paths'); // Log delete all action
        const deletedPathsCount = await Paths.destroy({ where: {} }); // Delete all paths
        return res.status(200).json({ // Respond with a message and count of deleted paths
            message: 'Deleted all paths.',
            deletedPathsCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;