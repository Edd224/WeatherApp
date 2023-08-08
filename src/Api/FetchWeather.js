import axios from "axios";

const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"; // Nová URL pre získanie predpovede
const API_KEY = "21b17ce1518a5be6b1097495053cb5eb";

export const fetchCurrentWeather = async (query) => {
  const { data } = await axios.get(CURRENT_WEATHER_URL, {
    params: {
      q: query,
      units: "metric",
      APPID: API_KEY,
    },
  });
  return data;
};

export const fetchWeatherForecast = async (query) => {
  const { data } = await axios.get(FORECAST_URL, {
    params: {
      q: query,
      units: "metric",
      APPID: API_KEY,
    },
  });
  return data;
};

export const getWeatherType = (weatherDescription) => {
  let type;
  if (weatherDescription.includes("clear")) {
    type = "sunny";
  } else if (weatherDescription.includes("cloud")) {
    type = "cloudy";
  } else if (weatherDescription.includes("rain")) {
    type = "rainy";
  } else {
    type = "default";
  }

  return type;
};