/** 
 * @type {HTMLElement} 
 * @description The HTML element representing the weather icon, which may display current weather conditions.
 */
const weatherIcon = document.getElementById('weather-icon');
export let currentWeather;
// =============================================================================        
// ========================= Initialization Functions ===========================
// =============================================================================

/**
 * Initializes the weather component by generating random weather data and updating the weather icon.
 * 
 * This function sets up the weather component by generating random weather data and updating the weather icon.
 * It logs the initialization process for debugging purposes.

 * @function initializeWeather
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the weather icon element is not found.
 */
export function initializeWeather() {
    console.info('%c ↓ initializeWeather() Starting ↓', 'color: lightgray');
    currentWeather = generateRandomWeather(); // Initialize currentWeather
    // Attach a click event listener to the weather icon button
    if (weatherIcon) {
        weatherIcon.addEventListener('click', () => {
            // Generate new random weather data
            generateRandomWeather();
        });
    } else {
        console.error("Weather icon element not found.");
    }

    console.info('%c ↑ initializeWeather() Complete ↑', 'color: darkgray');
}




export function generateRandomWeather() {
    const conditions = ['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'];
    const icons = {
        'clear': '01d', // Clear sky
        'fewclouds': '02d', // Few clouds
        'clouds': '04d', 
        'rain': '10d', // Rain
        'thunderstorm': '11d', // Thunderstorm
        'snow': '13d', // Snow
        'mist': '50d' // Mist
    };

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const icon = icons[condition];

    currentWeather = {
        condition: condition,
        temperature: Math.floor(Math.random() * 35) - 5, // Range from -5°C to 30°C
        humidity: Math.floor(Math.random() * 100),
        wind: (Math.random() * 15).toFixed(1),
        icon: icon
    };
    // Update the button icon using the new weather data
    updateWeatherIcon(currentWeather);
}

export function updateWeatherIcon(currentWeather) {
    if (!currentWeather.icon) {
        console.warn("Weather icon element not found.");
        return;
    }
    const iconMap = {
        '01': '☀️', // Clear sky
        '02': '⛅', // Few clouds
        '04': '☁️', // clouds
        '09': '🌧️', // Shower rain
        '10': '🌦️', // Rain
        '11': '⛈️', // Thunderstorm
        '13': '❄️', // Snow
        '50': '🌫️'  // Mist
    };

    const iconCode = currentWeather.icon.slice(0, 2);
    weatherIcon.textContent = iconMap[iconCode] || '🌍'; // Set the icon based on the weather data
    weatherIcon.title = `Current weather: ${currentWeather.condition}, ${currentWeather.temperature}°C`;
}

export function getWeather() {
    return currentWeather;
}

