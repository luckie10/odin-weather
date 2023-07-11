import { svgs } from "./assets/svg";
import weatherConditions from "./conditioncode.json";
import { createElement, removeAllChildren } from "./utils";
import { format, isAfter, isSameHour, isSameDay } from "date-fns";

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

  const formatDayDate = (time, localTime) => {
    const date = new Date(`${time}T00:00:00`);

    if (isSameDay(date, localTime)) return "Today";
    else return format(date, "E");
  };

  const generateDayForecast = (forecast) => {
    const day = createElement("div", { class: "daily-day" });

    const date = createElement("div", { class: "daily-date" });
    const condition = createElement("div", { class: "daily-condition" });
    const minMaxTemp = createElement("div", { class: "daily-min-max-temp" });
    const max = createElement("span", { class: "daily-max" });
    const min = createElement("span", { class: "daily-min" });

    const localTime = new Date(forecast.localtime);
    date.textContent = formatDayDate(forecast.date, localTime);
    const conditionIcon = generateConditionIcon(forecast.condition.code);
    condition.append(conditionIcon);
    max.textContent = forecast.max;
    min.textContent = forecast.min;
    minMaxTemp.append(min, " | ", max);

    day.append(date, condition, minMaxTemp);
    return day;
  };

  const loadDailyForecast = (weather, metric = true) => {
    const wholeForecast = weather.forecast.forecastday;
    const dailyForecast = document.querySelector(".daily-forecast");
    removeAllChildren(dailyForecast);

    for (const forecast of wholeForecast) {
      const forecastDay = forecast.day;
      const day = generateDayForecast({
        localtime: weather.location.localtime,
        date: forecast.date,
        condition: forecastDay.condition,
        min:
          Math.round(metric ? forecastDay.mintemp_c : forecastDay.mintemp_f) +
          "°",
        max:
          Math.round(metric ? forecast.day.maxtemp_c : forecastDay.mintemp_f) +
          "°",
      });
      dailyForecast.append(day);
    }
  };

  const generateHourForecast = (hourForecast, metric = true) => {
    const hourlyHour = createElement("div", { class: "hourly-hour" });

    const time = createElement("div", { class: "hourly-time" });
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
      Math.round(metric ? hourForecast.temp_c : hourForecast.temp_f) + "°";

    hourlyHour.append(time, condition, temp);
    return hourlyHour;
  };

  const loadHourlyForecast = (weather, metric = true) => {
    const wholeForecast = weather.forecast.forecastday;
    const hourlyForecast = document.querySelector(".hourly-forecast");
    removeAllChildren(hourlyForecast);

    for (const forecast of wholeForecast) {
      for (const hour of forecast.hour) {
        const time = new Date(hour.time);
        const localTime = new Date(weather.location.localtime);
        console.log(localTime);
        if (isAfter(time, localTime) || isSameHour(time, localTime))
          hourlyForecast.append(generateHourForecast(hour, metric));
      }
    }
  };

  const loadWeather = (weather, metric = true) => {
    console.log(weather);
    loadCurrent(weather);
    loadHourlyForecast(weather);
    loadDailyForecast(weather);
  };

  return {
    loadWeather,
  };
})();

export { WeatherUI as default };
