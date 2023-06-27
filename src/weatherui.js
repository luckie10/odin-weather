import { svgs } from "./assets/svg";
import weatherConditions from "./conditioncode.json";

const WeatherUI = (() => {
  const getIconName = (conditionCode, day) => {
    const condition = weatherConditions.find(
      ({ code }) => code === conditionCode
    );
    return day ? condition.icon.day : condition.icon.night;
  };

  const generateConditionIcon = (conditionCode, day) => {
    const iconName = getIconName(conditionCode, day);
    const img = document.createElement("img");
    img.src = svgs[iconName];
    return img;
  };

  const loadCurrent = (currWeather, metric = true) => {
    const weatherWrapper = document.querySelector(".current-weather-wrapper");
    const dateTime = weatherWrapper.querySelector(".date-time");
    const tempCurrent = weatherWrapper.querySelector(".temp-current");
    const conditionText = weatherWrapper.querySelector(".condition-text");
    const conditionIcon = weatherWrapper.querySelector(".condition-icon");
    const feelsLike = weatherWrapper.querySelector(".feelslike");
    const humidity = weatherWrapper.querySelector(".humidity");
    const wind = weatherWrapper.querySelector(".wind");

    dateTime.textContent = currWeather.last_updated;
    tempCurrent.textContent = metric
      ? `${currWeather.temp_c}°C`
      : `${currWeather.temp_f}°F`;

    conditionText.textContent = currWeather.condition.text;
    const icon = generateConditionIcon(
      currWeather.condition.code,
      currWeather.is_day
    );
    conditionIcon.append(icon);

    feelsLike.textContent = `Feels like ${
      metric ? currWeather.feelslike_c : currWeather.feelslike_f
    } °${metric ? "C" : "F"}`;
    humidity.textContent = currWeather.humidity + "%";
    wind.textContent =
      (metric ? `${currWeather.wind_kph}kph ` : `${currWeather.wind_mph}mph `) +
      currWeather.wind_dir;
  };

  return {
    loadCurrent,
  };
})();

export { WeatherUI as default };
