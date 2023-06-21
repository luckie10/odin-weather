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
    const dateTime = document.querySelector(".date-time");
    const temp = document.querySelector(".temp");
    const conditionText = document.querySelector(".condition-text");
    const conditionIcon = document.querySelector(".condition-icon");

    dateTime.textContent = currWeather.last_updated;
    temp.textContent = metric ? currWeather.temp_c : currWeather.temp_f;
    conditionText.textContent = currWeather.condition.text;

    const icon = generateConditionIcon(
      currWeather.condition.code,
      currWeather.is_day
    );
    conditionIcon.append(icon);
  };

  return { loadCurrent };
})();

export { WeatherUI as default };
