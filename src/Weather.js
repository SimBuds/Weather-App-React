import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const processForecastData = (forecastData) => {
        const dailyData = {};
        forecastData.forEach((item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyData[date] && Object.keys(dailyData).length < 5) { // Limit to 5 days
                dailyData[date] = item;
            }
        });
        return Object.values(dailyData);
    };

    const fetchWeather = () => {
        setIsLoading(true);
        setError(null);
        const apiKey = '81f681e98749226b5e049ede58121aa7';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        axios.get(url)
            .then(response => {
                setCurrentWeather(response.data);
                return axios.get(forecastUrl);
            })
            .then(response => {
                const forecastData = processForecastData(response.data.list);
                setForecast(forecastData);
                setIsLoading(false);
            })
            .catch(error => {
                setError("Failed to fetch weather data. Please check the city name.");
                setCurrentWeather(null);
                setForecast(null);
                setIsLoading(false);
            });
    };

    const formatDate = (dt) => new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="container-fluid weather-app">
            <div className="weather-app-content">
                <div className="row">
                    <div className="col-md-6 pr-md-4">
                        <div className="custom-search-box my-3">
                            <input 
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter city name"
                                className="custom-form-control"
                            />
                            <button onClick={fetchWeather} className="custom-btn ml-2">Get Weather</button>
                        </div>
                        {isLoading && <p>Loading...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {currentWeather && (
                            <div className="custom-weather-info mt-3">
                                <h2 className="city-name">{currentWeather.name}</h2>
                                <h4 className="city-name">{formatDate(currentWeather.dt)}</h4>
                                <div className="custom-weather-condition d-flex align-items-center justify-content-center my-3">
                                    <img 
                                        src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`} 
                                        alt="Weather icon" 
                                        className="weather-icon"
                                    />
                                    <div className="temperature-description ml-3">
                                        <p className="temperature">{Math.round(currentWeather.main.temp)} °C</p>
                                        <p className="description">{currentWeather.weather[0].main}</p>
                                    </div>
                                </div>
                                <div className="additional-info">
                                    <p>Humidity: {currentWeather.main.humidity}%</p>
                                    <p>Wind: {currentWeather.wind.speed} meter/sec</p>
                                    <p>Pressure: {currentWeather.main.pressure} hPa</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 pr-md-4">
                        {forecast && (
                            <div className="custom-forecast">
                                <h3 className="forecast-title">5-Day Forecast</h3>
                                <div className="d-flex justify-content-between">
                                    {forecast.slice(0, 5).map((item, index) => (
                                        <div key={index} className="forecast-item card">
                                            <div className="card-body">
                                                <h5 className="card-title">{formatDate(item.dt)}</h5>
                                                <img 
                                                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                                                    alt="Weather icon" 
                                                    className="forecast-icon"
                                                />
                                                <p className="card-text">{Math.round(item.main.temp)} °C</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;