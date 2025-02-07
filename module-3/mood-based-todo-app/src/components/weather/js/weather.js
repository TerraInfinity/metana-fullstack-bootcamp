// Move the generateRandomWeather function to the top
export function generateRandomWeather() {
    const conditions = ['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'];
    const icons = {
        'clear': '01d', // Clear sky

        'clouds': '02d', // Few clouds
        'rain': '10d', // Rain
        'snow': '13d', // Snow
        'thunderstorm': '11d', // Thunderstorm
        'mist': '50d' // Mist
    };

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const icon = icons[condition];

    return {
        condition: condition,
        temperature: Math.floor(Math.random() * 35) - 5, // Range from -5°C to 30°C
        humidity: Math.floor(Math.random() * 100),
        wind: (Math.random() * 15).toFixed(1),
        icon: icon
    };
}

export function updateWeatherIcon(weatherData, weatherIconElement) {
    if (!weatherIconElement) {
        console.warn("Weather icon element not found.");
        return;
    }
    const iconMap = {
        '01': '☀️', // Clear sky
        '02': '⛅', // Few clouds
        '03': '☁️', // Scattered clouds
        '04': '☁️', // Broken clouds
        '09': '🌧️', // Shower rain
        '10': '🌦️', // Rain
        '11': '⛈️', // Thunderstorm
        '13': '❄️', // Snow
        '50': '🌫️'  // Mist
    };

    const iconCode = weatherData.icon.slice(0, 2);
    weatherIconElement.textContent = iconMap[iconCode] || '🌍'; // Set the icon based on the weather data
    weatherIconElement.title = `Current weather: ${weatherData.condition}, ${weatherData.temperature}°C`;
}