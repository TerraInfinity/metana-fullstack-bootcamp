import { updateSuggestedTasks } from '/javascripts/misc-components/mood-selector/mood-selector.js'; // Importing updateSuggestedTasks if needed

/** 
 * @type {HTMLElement} 
 * @description The HTML element representing the weather icon, which may display current weather conditions.
 */
const weatherIcon = document.getElementById('weather-icon');
export let currentWeather;

/**
 * @type {HTMLElement}
 * @description The weather modal element, which will be fetched and initialized
 */
let weatherModal = null;

// Define shared constant for icon mapping
const ICON_MAP = {
    '01': '☀️', // Clear sky
    '02': '⛅', // Few clouds
    '04': '☁️', // clouds
    '09': '🌧️', // Shower rain
    '10': '🌦️', // Rain
    '11': '⛈️', // Thunderstorm
    '13': '❄️', // Snow
    '50': '🌫️' // Mist
};

// =============================================================================        
// ========================= Initialization Functions ===========================
// =============================================================================

/**
 * Initializes the weather component by fetching real weather data and updating the weather icon.
 * Falls back to random weather generation if the API call fails.
 * 
 * This function sets up the weather component by fetching real weather data and updating the weather icon.
 * It logs the initialization process for debugging purposes.

 * @function initializeWeather
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the weather icon element is not found.
 */
export function initializeWeather() {
    console.info('%c ↓ initializeWeather() Starting ↓', 'color: lightgray');

    // Fetch and initialize the weather modal template
    initializeWeatherModal();

    // Try to fetch real weather data, fall back to random weather if it fails
    fetchRealWeather()
        .then(weather => {
            console.debug('Successfully initialized weather:', weather);
        })
        .catch(error => {
            console.warn('Failed to fetch real weather data, using random weather instead:', error);
            currentWeather = generateRandomWeather(); // Initialize with random weather as fallback
        });

    // Attach a click event listener to the weather icon button
    if (weatherIcon) {
        weatherIcon.addEventListener('click', async() => {
            try {
                // Use await to properly handle the async call
                await fetchRealWeather();
                console.debug('%c Weather refreshed successfully', 'color: aqua');

                // Show the weather details modal
                showWeatherModal();

            } catch (error) {
                console.warn('Failed to fetch real weather data on click, using random weather instead:', error);
                generateRandomWeather(); // Fall back to random weather
                showWeatherModal();
            }
        });
    } else {
        console.error("Weather icon element not found.");
    }

    console.info('%c ↑ initializeWeather() Complete ↑', 'color: darkgray');
}

/**
 * Fetches and initializes the weather modal from the HBS template
 */
async function initializeWeatherModal() {
    try {
        // Check if we already have the modal in the DOM
        if (document.getElementById('weather-modal')) {
            weatherModal = document.getElementById('weather-modal');
            return;
        }

        // Fetch the weather modal template
        const response = await fetch('/templates/misc-components/weatherModal.hbs');
        if (!response.ok) {
            throw new Error(`Failed to fetch weather modal template: ${response.statusText}`);
        }

        const templateHtml = await response.text();

        // Create a temporary container to hold the template
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = templateHtml;

        // Add the modal to the document body
        document.body.appendChild(tempContainer.firstElementChild);
        weatherModal = document.getElementById('weather-modal');

        // Add CSS for the large weather icon
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .large-weather-icon {
                font-size: 4rem;
            }
        `;
        document.head.appendChild(styleElement);

        // Add event listeners for the modal
        document.getElementById('close-weather-modal').addEventListener('click', hideWeatherModal);
        document.getElementById('refresh-weather').addEventListener('click', async() => {
            try {
                await fetchRealWeather();
                updateWeatherModal();
            } catch (error) {
                console.error('Failed to refresh weather:', error);
            }
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === weatherModal) {
                hideWeatherModal();
            }
        });

        console.debug('Weather modal initialized successfully');
    } catch (error) {
        console.error('Error initializing weather modal:', error);
    }
}

/**
 * Shows the weather modal and populates it with current weather data
 */
function showWeatherModal() {
    if (!weatherModal) {
        console.error('Weather modal not initialized');
        return;
    }

    updateWeatherModal();
    weatherModal.style.display = 'block';
}

/**
 * Hides the weather modal
 */
function hideWeatherModal() {
    if (weatherModal) {
        weatherModal.style.display = 'none';
    }
}

/**
 * Updates the weather modal with current weather data
 */
function updateWeatherModal() {
    if (!currentWeather || !weatherModal) {
        console.warn("Weather data or modal not available");
        return;
    }

    const iconCode = currentWeather.icon.slice(0, 2);
    document.getElementById('weather-modal-icon').textContent = ICON_MAP[iconCode] || '🌍';

    // Location
    document.getElementById('weather-location-name').textContent = currentWeather.location.name || 'Unknown Location';
    document.getElementById('weather-location-region').textContent =
        `${currentWeather.location.region || ''}, ${currentWeather.location.country || ''}`.trim();

    // Weather data
    document.getElementById('weather-condition').textContent =
        currentWeather.condition.charAt(0).toUpperCase() + currentWeather.condition.slice(1);
    document.getElementById('weather-temperature').textContent = currentWeather.temperature;
    document.getElementById('weather-humidity').textContent = currentWeather.humidity;
    document.getElementById('weather-wind').textContent = currentWeather.wind;
}

/**
 * Fetches real weather data from the server-side API endpoint.
 * The API key is stored securely on the server side.
 * 
 * @async
 * @function fetchRealWeather
 * @returns {Promise<Object>} A promise that resolves to the current weather object
 * @throws {Error} If the API request fails
 */
export async function fetchRealWeather() {
    console.info('%c ↓ fetchRealWeather() Starting ↓', 'color: lightgray');
    try {
        // Fetch weather data from our server API endpoint (which securely holds the API key)
        const response = await fetch('/api/weather');
        console.debug('%c fetchRealWeather() response', 'color: aqua', response);

        if (!response.ok) {
            throw new Error(`Weather API request failed with status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.debug('%c fetchRealWeather() weatherData', 'color: aqua', data);

        // Map the API response to our app's format
        currentWeather = {
            condition: mapConditionToApp(data.current.condition.text, data.current.condition.code),
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            wind: data.current.wind_kph.toFixed(1),
            icon: mapIconToApp(data.current.condition.code),
            location: data.location
        };

        // Update the weather icon with the new data
        updateWeatherIcon(currentWeather);

        // Update suggested tasks based on new weather
        updateSuggestedTasks();

        console.info('Real weather data fetched successfully:', currentWeather);
        console.info('%c ↑ fetchRealWeather() Complete ↑', 'color: darkgray');

        return currentWeather;
    } catch (error) {
        console.error('Error fetching real weather data:', error);
        throw error; // Re-throw to allow the caller to handle the error
    }
}

/**
 * Maps the weatherapi.com condition to our app's condition categories
 * @param {string} conditionText - Text description from the API
 * @param {number} conditionCode - Condition code from the API
 * @returns {string} - One of: 'clear', 'fewclouds', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'
 */
function mapConditionToApp(conditionText, conditionCode) {
    // Clear skies
    if (conditionCode === 1000) return 'clear';

    // Few clouds
    if (conditionCode === 1003) return 'fewclouds';

    // Cloudy skies
    if (conditionCode === 1006 || conditionCode === 1009) return 'clouds';

    // Rain (no thunder)
    if (
        conditionCode === 1063 || // Patchy rain nearby
        conditionCode === 1150 || // Patchy light drizzle
        conditionCode === 1153 || // Light drizzle
        conditionCode === 1168 || // Freezing drizzle
        conditionCode === 1171 || // Heavy freezing drizzle
        conditionCode === 1180 || // Patchy light rain
        conditionCode === 1183 || // Light rain
        conditionCode === 1186 || // Moderate rain at times
        conditionCode === 1189 || // Moderate rain
        conditionCode === 1192 || // Heavy rain at times
        conditionCode === 1195 || // Heavy rain
        conditionCode === 1198 || // Light freezing rain
        conditionCode === 1201 || // Moderate or heavy freezing rain
        conditionCode === 1240 || // Light rain shower
        conditionCode === 1243 || // Moderate or heavy rain shower
        conditionCode === 1246 // Torrential rain shower
    ) return 'rain';

    // Thunderstorm
    if (
        conditionCode === 1087 || // Thundery outbreaks in nearby
        conditionCode === 1273 || // Patchy light rain with thunder
        conditionCode === 1276 || // Moderate or heavy rain with thunder
        conditionCode === 1279 || // Patchy light snow with thunder
        conditionCode === 1282 // Moderate or heavy snow with thunder
    ) return 'thunderstorm';

    // Snow (includes sleet and ice pellets)
    if (
        conditionCode === 1066 || // Patchy snow nearby
        conditionCode === 1069 || // Patchy sleet nearby
        conditionCode === 1072 || // Patchy freezing drizzle nearby
        conditionCode === 1114 || // Blowing snow
        conditionCode === 1117 || // Blizzard
        conditionCode === 1210 || // Patchy light snow
        conditionCode === 1213 || // Light snow
        conditionCode === 1216 || // Patchy moderate snow
        conditionCode === 1219 || // Moderate snow
        conditionCode === 1222 || // Patchy heavy snow
        conditionCode === 1225 || // Heavy snow
        conditionCode === 1204 || // Light sleet
        conditionCode === 1207 || // Moderate or heavy sleet
        conditionCode === 1237 || // Ice pellets
        conditionCode === 1249 || // Light sleet showers
        conditionCode === 1252 || // Moderate or heavy sleet showers
        conditionCode === 1255 || // Light snow showers
        conditionCode === 1258 || // Moderate or heavy snow showers
        conditionCode === 1261 || // Light showers of ice pellets
        conditionCode === 1264 // Moderate or heavy showers of ice pellets
    ) return 'snow';

    // Mist/Fog
    if (
        conditionCode === 1030 || // Mist
        conditionCode === 1135 || // Fog
        conditionCode === 1147 // Freezing fog
    ) return 'mist';

    // If code doesn't match anything, return a default
    return 'clouds';
}

/**
 * Maps the weatherapi.com condition code to our app's icon format
 * @param {number} conditionCode - Condition code from the API
 * @returns {string} - Icon code in our app's format (e.g. '01d')
 */
function mapIconToApp(conditionCode) {
    // Clear sky
    if (conditionCode === 1000) return '01d';

    // Few clouds
    if (conditionCode === 1003) return '02d';

    // Cloudy skies
    if (conditionCode === 1006 || conditionCode === 1009) return '04d';

    // Mist
    if (conditionCode === 1030 || conditionCode === 1135 || conditionCode === 1147) return '50d';

    // Rain
    if (
        conditionCode === 1063 || // Patchy rain nearby
        conditionCode === 1150 || // Patchy light drizzle
        conditionCode === 1153 || // Light drizzle
        conditionCode === 1168 || // Freezing drizzle
        conditionCode === 1171 || // Heavy freezing drizzle
        conditionCode === 1180 || // Patchy light rain
        conditionCode === 1183 || // Light rain
        conditionCode === 1186 || // Moderate rain at times
        conditionCode === 1189 || // Moderate rain
        conditionCode === 1192 || // Heavy rain at times
        conditionCode === 1195 || // Heavy rain
        conditionCode === 1198 || // Light freezing rain
        conditionCode === 1201 || // Moderate or heavy freezing rain
        conditionCode === 1240 || // Light rain shower
        conditionCode === 1243 || // Moderate or heavy rain shower
        conditionCode === 1246 // Torrential rain shower
    ) return '10d';

    // Snow
    if (
        conditionCode === 1066 || // Patchy snow nearby
        conditionCode === 1069 || // Patchy sleet nearby
        conditionCode === 1072 || // Patchy freezing drizzle nearby
        conditionCode === 1114 || // Blowing snow
        conditionCode === 1117 || // Blizzard
        conditionCode === 1210 || // Patchy light snow
        conditionCode === 1213 || // Light snow
        conditionCode === 1216 || // Patchy moderate snow
        conditionCode === 1219 || // Moderate snow
        conditionCode === 1222 || // Patchy heavy snow
        conditionCode === 1225 || // Heavy snow
        conditionCode === 1204 || // Light sleet
        conditionCode === 1207 || // Moderate or heavy sleet
        conditionCode === 1237 || // Ice pellets
        conditionCode === 1249 || // Light sleet showers
        conditionCode === 1252 || // Moderate or heavy sleet showers
        conditionCode === 1255 || // Light snow showers
        conditionCode === 1258 || // Moderate or heavy snow showers
        conditionCode === 1261 || // Light showers of ice pellets
        conditionCode === 1264 // Moderate or heavy showers of ice pellets
    ) return '13d';

    // Thunderstorm
    if (
        conditionCode === 1087 || // Thundery outbreaks in nearby
        conditionCode === 1273 || // Patchy light rain with thunder
        conditionCode === 1276 || // Moderate or heavy rain with thunder
        conditionCode === 1279 || // Patchy light snow with thunder
        conditionCode === 1282 // Moderate or heavy snow with thunder
    ) return '11d';

    // Default to clear sky if we can't determine
    return '01d';
}

export function generateRandomWeather() {
    // Map of conditions to our icon codes - we can use our existing mapIconToApp function
    const conditions = ['clear', 'fewclouds', 'clouds', 'rain', 'thunderstorm', 'snow', 'mist'];

    // Select a random condition
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    // Use our existing mapping function instead of duplicating the logic
    const icon = condition === 'fewclouds' ? '02d' :
        condition === 'clear' ? '01d' :
        condition === 'clouds' ? '04d' :
        condition === 'rain' ? '10d' :
        condition === 'thunderstorm' ? '11d' :
        condition === 'snow' ? '13d' :
        condition === 'mist' ? '50d' : '01d';

    currentWeather = {
        condition: condition,
        temperature: Math.floor(Math.random() * 35) - 5, // Range from -5°C to 30°C
        humidity: Math.floor(Math.random() * 100),
        wind: (Math.random() * 15).toFixed(1),
        icon: icon,
        location: {
            name: "Random City",
            region: "Random Region",
            country: "Random Country"
        }
    };

    // Update the UI with the new weather data
    updateWeatherIcon(currentWeather);
    updateSuggestedTasks();

    return currentWeather;
}

export function updateWeatherIcon(currentWeather) {
    if (!weatherIcon || !currentWeather || !currentWeather.icon) {
        console.warn("Weather icon or data not available");
        return;
    }

    const iconCode = currentWeather.icon.slice(0, 2);
    weatherIcon.textContent = ICON_MAP[iconCode] || '🌍'; // Set the icon based on the weather data

    let locationName = '';
    if (currentWeather.location && currentWeather.location.name) {
        locationName = ` in ${currentWeather.location.name}`;
    }

    weatherIcon.title = `Current weather: ${currentWeather.condition}, ${currentWeather.temperature}°C${locationName}`;
}

export function getWeather() {
    return currentWeather;
}