/**
 * @file thumbnailRoutes.js
 * @description This file contains routes for acquiring video thumbnails used in blog cards.
 * This file defines the routes for fetching and processing thumbnails from various sources.
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const axios = require('axios'); // Use axios for better request handling

// Helper function to resolve Twitter URLs (t.co, pic.twitter.com) to pbs.twimg.com
// Removed Twitter image resolution logic

// Proxy endpoint for Twitter/X oEmbed
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

// Proxy endpoint for thumbnail extraction (e.g., Omniflix)
router.get('/proxy-thumbnail', async(req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    //console.log('Received request for proxy-thumbnail with URL:', url);
    try {
        const response = await fetch(url);
        const html = await response.text();
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