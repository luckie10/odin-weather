import WeatherAPI from "./weatherapi";
import LocationSearch from "./search.js";
import WeatherUI from "./weatherui";

import "./style.scss";

LocationSearch.attachEventHandlers();

const weather = await WeatherAPI.getForecast(
  "Windsor, Ontario, Canada",
  "no",
  14
);
WeatherUI.loadWeather(weather);
