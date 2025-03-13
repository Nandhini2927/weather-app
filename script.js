async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'f63c9673c61f7c83018c5ed0706a91eb';  // Get your API key from https://openweathermap.org/
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const forecastResponse = await fetch(forecastUrl);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        // Weather condition emoji mapping
        let weatherEmoji = '';
        const weatherCondition = weatherData.weather[0].description.toLowerCase();
        if (weatherCondition.includes('clear')) {
            weatherEmoji = '☀️'; // Sunny
        } else if (weatherCondition.includes('cloud')) {
            weatherEmoji = '☁️'; // Cloudy
        } else if (weatherCondition.includes('rain')) {
            weatherEmoji = '🌧️'; // Rainy
        } else if (weatherCondition.includes('snow')) {
            weatherEmoji = '❄️'; // Snowy
        } else {
            weatherEmoji = '🌤️'; // Default to partly cloudy
        }

        // Display current weather data with emoji
        document.getElementById('weatherDetails').innerHTML = `
            <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
            <p>Temperature: ${weatherData.main.temp}°C ${weatherEmoji}</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
        `;

        // Display 5-day forecast data
        const forecastHTML = forecastData.list
            .filter((_, index) => index % 8 === 0) // Show data every 24 hours
            .map(day => {
                let forecastEmoji = '';
                const forecastCondition = day.weather[0].description.toLowerCase();
                if (forecastCondition.includes('clear')) {
                    forecastEmoji = '☀️';
                } else if (forecastCondition.includes('cloud')) {
                    forecastEmoji = '☁️';
                } else if (forecastCondition.includes('rain')) {
                    forecastEmoji = '🌧️';
                } else if (forecastCondition.includes('snow')) {
                    forecastEmoji = '❄️';
                } else {
                    forecastEmoji = '🌤️';
                }
                return `
                    <p>${new Date(day.dt_txt).toLocaleDateString()} - ${day.main.temp}°C ${forecastEmoji}</p>
                `;
            })
            .join('');

        document.getElementById('forecast').innerHTML = `<h3>5-Day Forecast:</h3>${forecastHTML}`;

    } catch (error) {
        document.getElementById('weatherDetails').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
