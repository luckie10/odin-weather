import { svgs } from "./assets/svg";
import weatherConditions from "./conditioncode.json";
import { createElement, removeAllChildren } from "./utils";
import { format, isPast, isThisHour, isToday, isTomorrow } from "date-fns";

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

  const formatDayDate = (stringDate) => {
    const date = new Date(`${stringDate}T00:00:00`);

    if (isToday(date)) return "Today";
    else if (isTomorrow(date)) return "Tomorrow";
    else return format(date, "E");
  };

  const generateDayForecast = (forecast) => {
    const day = createElement("div", { class: "daily-day" });

    const date = createElement("div", { class: "daily-date" });
    const condition = createElement("div", { class: "daily-condition" });
    const minMaxTemp = createElement("div", { class: "daily-min-max-temp" });
    const max = createElement("span", { class: "daily-max" });
    const min = createElement("span", { class: "daily-min" });

    date.textContent = formatDayDate(forecast.date);
    const conditionIcon = generateConditionIcon(forecast.condition.code);
    condition.append(conditionIcon);
    max.textContent = forecast.max;
    min.textContent = forecast.min;
    minMaxTemp.append(min, " | ", max);

    day.append(date, condition, minMaxTemp);
    return day;
  };

  const loadDailyForecast = (wholeForecast, metric = true) => {
    const dailyForecast = createElement("div", { class: "daily-forecast" });

    for (const forecast of wholeForecast) {
      const forecastDay = forecast.day;
      const day = generateDayForecast({
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
    const forecastList = document.querySelector(".forecast");
    forecastList.append(dailyForecast);
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
