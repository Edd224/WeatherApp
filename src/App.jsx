import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchCurrentWeather, fetchWeatherForecast, getWeatherType } from "./Api/FetchWeather";
import { Wind } from "@phosphor-icons/react";

const App = () => {
  const [query, setQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [weatherType, setWeatherType] = useState("default");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");


  // Pozadia podľa počasia
  useEffect(() => {
    if (currentWeather.weather && currentWeather.weather.length > 0) {
      const type = getWeatherType(currentWeather.weather[0].description);
      setWeatherType(type);
    }
  }, [currentWeather]);

  const search = async (event) => {
    if (event.key === "Enter") {
      const currentWeatherData = await fetchCurrentWeather(query);
      const forecastData = await fetchWeatherForecast(query);

      setCurrentWeather(currentWeatherData);
      setForecast(forecastData.list);
      setQuery("");
    }
  };

  const weatherDescriptions = {
    sunny: "Slnečno",
    cloudy: "Oblačno",
    rainy: "Daždivo",
    default: "Nedefinované",
  };



  return (
    // Pozadie aplikácie podľa počasia
    <div className={`flex h-screen flex-col justify-center items-center weather-${weatherType}`}>
      <input
        type="text"
        className="search"
        placeholder="Vyber mesto"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyPress={search}
      />
      {/* Aktuálne počasie */}
      {currentWeather.main && (
        <div className="flex flex-col justify-center items-center border-white border-[1px] rounded-md py-5 md:py-7 px-[15%] backdrop-blur-md">
          <div className="py-5 md:py-5 text-white text-2xl"> {new Date().toLocaleDateString("sk-SK")}</div>
          <h2 className="text-4xl text-white flex">
            <span className="">{currentWeather.name}</span>
            <sup className="text-xl p-5 md:p-2 bg-lime-700 ml-2 rounded-full">{currentWeather.sys.country}</sup>
          </h2>
          <div className="city-temp text-white text-5xl mt-2 font-bold">
            {Math.round(currentWeather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info flex flex-col items-center">
            <img
              className="city-icon w-28 animate-pulse"
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
            />
            <p className="text-white mt-3 text-2xl uppercase">{weatherDescriptions[weatherType]}</p>
          </div>
          <div className="wind-info flex flex-col items-center text-white text-xl mt-3">
            <Wind size={50} color="#fff" />
            Rýchlosť vetra: {currentWeather.wind.speed} m/s
            <br />
            Smer vetra: {currentWeather.wind.deg}°
          </div>
        </div>
      )}
      {/* Predpoveď počasia na 2 dni */}
      {forecast.length > 0 && (
        <div className="forecast-container flex justify-center items-center flex-col mt-5">
          <h2 className="text-white text-2xl md:text-4xl">Predpoveď na ďalšie dni:</h2>
          <div className="forecast-list flex flex-col md:flex-row justify-center items-center px-[8%]">
            {forecast
              .filter((item, index, arr) => {
                // Filtrovanie predpovedí podľa dňa 
                if (index === 0) return true;
                const currentDate = new Date(item.dt * 1000).toLocaleDateString("sk-SK");
                const prevDate = new Date(arr[index - 1].dt * 1000).toLocaleDateString("sk-SK");
                return currentDate !== prevDate;
              })
              .slice(0, 3)
              .map((item) => (
                <div className="backdrop-blur-sm m-4 p-2 md:p-10 md:m-8 flex flex-row items-center" key={item.dt}>
                  <p className="text-white text-lg px-2">{new Date(item.dt * 1000).toLocaleDateString("sk-SK")}</p>
                  <p className="text-white text-2xl px-2">{Math.round(item.main.temp)}&deg;C</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
