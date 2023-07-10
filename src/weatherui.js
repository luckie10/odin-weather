import { svgs } from "./assets/svg";
import weatherConditions from "./conditioncode.json";
import { createElement, removeAllChildren } from "./utils";
import { format, isPast, isThisHour } from "date-fns";

const WeatherUI = (() => {
  const getIconName = (conditionCode, day) => {
    const condition = weatherConditions.find(
      ({ code }) => code === conditionCode
    );
    return day ? condition.icon.day : condition.icon.night;
  };

  const generateConditionIcon = (conditionCode, day = 1) => {
    const iconName = getIconName(conditionCode, day);
    const img = document.createElement("img");
    img.src = svgs[iconName];
    return img;
  };

  const loadCurrent = (wholeWeather, metric = true) => {
    const currWeather = wholeWeather.current;
    const weatherLocation = wholeWeather.location;

    const weatherWrapper = document.querySelector(".current-weather-wrapper");
    const location = weatherWrapper.querySelector(".current-location");
    const dateTime = weatherWrapper.querySelector(".date-time");
    const tempCurrent = weatherWrapper.querySelector(".temp");
    const conditionText = weatherWrapper.querySelector(".condition-text");
    const conditionIcon = weatherWrapper.querySelector(".condition-icon");
    const feelsLike = weatherWrapper.querySelector(".feelslike");
    const humidity = weatherWrapper.querySelector(".humidity");
    const wind = weatherWrapper.querySelector(".wind");

    location.textContent = `${weatherLocation.name}`;
    // dateTime.textContent = currWeather.last_updated;
    tempCurrent.textContent =
      (metric ? Math.round(currWeather.temp_c) : currWeather.temp_f) + "°";

    conditionText.textContent = currWeather.condition.text;
    const icon = generateConditionIcon(
      currWeather.condition.code,
      currWeather.is_day
    );
    removeAllChildren(conditionIcon);
    conditionIcon.append(icon);

    feelsLike.textContent = `Feels like: ${
      metric ? currWeather.feelslike_c : currWeather.feelslike_f
    } °${metric ? "C" : "F"}`;
    humidity.textContent = `Humidity: ${currWeather.humidity}%`;
    wind.textContent =
      `Wind: ` +
      (metric ? `${currWeather.wind_kph}kph ` : `${currWeather.wind_mph}mph `) +
      `${currWeather.wind_degree}° ${currWeather.wind_dir}`;
  };

  const generateDayForecast = (forecast) => {
    const day = createElement("div", { class: "daily-day" });
    const date = createElement("div", { class: "daily-date" });
    const condition = createElement("div", { class: "daily-condition" });
    const max = createElement("div", { class: "daily-max" });
    const min = createElement("div", { class: "daily-min" });

    date.textContent = forecast.date;
    const conditionIcon = generateConditionIcon(forecast.condition.code);
    condition.append(conditionIcon);
    max.textContent = forecast.max;
    min.textContent = forecast.min;

    day.append(date, condition, max, min);
    return day;
  };

  const loadDailyForecast = (wholeForecast, metric = true) => {
    const forecastList = document.querySelector(".forecast");
    for (const forecast of wholeForecast) {
      const forecastDay = forecast.day;
      const day = generateDayForecast({
        date: forecast.date,
        condition: forecastDay.condition,
        min: metric ? forecastDay.mintemp_c + "°" : forecastDay.mintemp_f + "°",
        max: metric
          ? forecast.day.maxtemp_c + "°"
          : forecastDay.mintemp_f + "°",
      });
      forecastList.append(day);
    }
  };

  const generateHourForecast = (hourForecast, metric = true) => {
    const hour = createElement("div", { class: "hourly-hour" });
    const time = createElement("div", { class: "hourly-hour" });
    const condition = createElement("div", { class: "hourly-condition" });
    const temp = createElement("div", { class: "hourly-temp" });

    const getHour = format(new Date(hourForecast.time), "HH");
    time.textContent = getHour;
    const conditionIcon = generateConditionIcon(
      hourForecast.condition.code,
      hourForecast.is_day
    );
    condition.append(conditionIcon);
    temp.textContent =
      (metric ? hourForecast.temp_c : hourForecast.temp_f) + "°";

    hour.append(time, condition, temp);
    return hour;
  };

  const loadHourlyForecast = (wholeForecast, metric = true) => {
    const hourlyForecast = createElement("div", { class: "hourly-forecast" });

    for (const forecast of wholeForecast) {
      for (const hour of forecast.hour) {
        const time = new Date(hour.time);
        if (!isPast(time) || isThisHour(time))
          hourlyForecast.append(generateHourForecast(hour));
      }
    }
    const forecastList = document.querySelector(".forecast");
    forecastList.append(hourlyForecast);
  };

  return {
    loadCurrent,
    loadDailyForecast,
    loadHourlyForecast,
  };
})();

export { WeatherUI as default };
