import React, { useState } from 'react';
import axios from 'axios';

function WeatherApp() {
    const [weatherData, setWeatherData] = useState(null);

    const fetchWeather = (city) => {
        const apiKey = 'your_api_key';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        axios.get(url)
            .then(response => {
                setWeatherData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                setWeatherData(null);
            });
    };

    return (
        <div>
            <input type="text" placeholder="Enter city" onBlur={(e) => fetchWeather(e.target.value)} />
            {weatherData && <div>
                <h1>{weatherData.name}</h1>
                <p>Temperature: {weatherData.main.temp}</p>
                {/* Add more weather details here */}
            </div>}
        </div>
    );
}

export default WeatherApp;
