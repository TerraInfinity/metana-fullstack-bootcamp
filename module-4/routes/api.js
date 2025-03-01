/**
 * @file api.js
 * @description API routes for the application
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');

// WeatherAPI.com API key (stored server-side for security)
const WEATHER_API_KEY = '66c5fea00b504a0983c84613250103';

/**
 * GET /api/weather
 * Returns current weather data from weatherapi.com
 */
router.get('/weather', async(req, res) => {
    console.info('%c ↓ router.get(/weather) Starting ↓', 'color: lightgray');
    try {
        // Get user location, use IP lookup, recommended by weatherapi.com
        const query = 'auto:ip';

        // Fetch weather data from weatherapi.com
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}`);

        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Simply pass the relevant data from the API to the frontend
        const weatherData = {
            location: {
                name: data.location.name,
                region: data.location.region,
                country: data.location.country
            },
            current: {
                condition: {
                    text: data.current.condition.text,
                    code: data.current.condition.code
                },
                temp_c: data.current.temp_c,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph
            }
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
    console.info('%c ↑ router.get(/weather) Complete ↑', 'color: darkgray');
});

module.exports = router;