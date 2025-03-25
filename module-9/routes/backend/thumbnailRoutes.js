/**
 * @file thumbnailRoutes.js
 * @description This file contains routes for acquiring video thumbnails used in blog cards.
 * It defines endpoints for fetching and processing thumbnails from various sources, including
 * proxying requests for oEmbed data and extracting thumbnails from HTML content.
 * 
 * Note: In some instances, certain videos are harder to pull the thumbnail from than others.
 * This code is designed to manually fetch the thumbnail in those cases to ensure a consistent
 * user experience.
 */

const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios'); // Use axios for better request handling
const { protect, isAdmin, isCreatorOrAdmin } = require('../../middleware/authMiddleware');

// Helper function to resolve Twitter URLs (t.co, pic.twitter.com) to pbs.twimg.com
// Removed Twitter image resolution logic

// Proxy endpoint for Twitter/X oEmbed
/**
 * @route GET /proxy-oembed
 * @param {string} url - The URL to fetch oEmbed data from.
 * @returns {Object} 404 error if no thumbnail is found or 400 if URL is missing.
 * @throws {500} If there is an error fetching oEmbed data.
 */
router.get('/proxy-oembed', async(req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    console.log('Fetching oEmbed for:', url);

    try {
        // Removed oEmbed fetching and processing logic
        // Returning a 404 error directly since Twitter/X handling is removed
        return res.status(404).json({ error: 'No thumbnail found for Twitter/X' });
    } catch (error) {
        console.error('Error fetching oEmbed data:', error.message);
        return res.status(500).json({ error: 'Failed to fetch oEmbed data' });
    }
});

// Proxy endpoint for thumbnail extraction (e.g., Omniflix) - Updated to axios
/**
 * @route GET /proxy-thumbnail
 * @param {string} url - The URL to extract the thumbnail from.
 * @returns {Object} JSON object containing the extracted thumbnail or 404 error if not found.
 * @throws {500} If there is an error fetching the thumbnail.
 * 
 * Note: This endpoint is crucial for manually fetching thumbnails from URLs that may not
 * provide them easily. It ensures that users receive a thumbnail even when automatic
 * extraction fails.
 */
router.get('/proxy-thumbnail', async(req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    //console.log('Received request for proxy-thumbnail with URL:', url);
    try {
        const response = await axios.get(url); // Switched from fetch to axios
        const html = response.data; // axios provides data directly
        const $ = cheerio.load(html);
        const thumbnail = $('meta[property="og:image"]').attr('content');
        // console.log('Fetched HTML for thumbnail extraction:', html);
        if (thumbnail) {
            console.log('Extracted thumbnail:', thumbnail);
            res.json({ thumbnail });
        } else {
            res.status(404).json({ error: 'No thumbnail found' });
        }
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
});

module.exports = router;