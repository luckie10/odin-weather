import WeatherAPI from "./weatherapi";
import WeatherUI from "./weatherui";

const LocationSearch = (function () {
  const searchInput = document.querySelector(".search-input");
  const datalist = document.getElementById("locations");

  const clearLocationOptions = () => {
    while (datalist.firstChild) {
      datalist.removeChild(datalist.firstChild);
    }
  };

  const populateLocationOptions = (options) => {
    clearLocationOptions();

    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = `${opt.name}, ${opt.region}, ${opt.country}`;

      datalist.append(option);
    });
  };

  const inputHandler = async (e) => {
    const input = e.target.value;
    if (input.length < 3) return;

    const locationSuggestions = await WeatherAPI.getLocationSuggestions(input);
    populateLocationOptions(locationSuggestions);
  };

  const validateLocation = (location) => {
    const response = document.querySelector(
      `#locations option[value='${location}']`
    );

    if (response === null) {
      console.log("Location invalid");
      return false;
    }
    return true;
  };

  const searchHandler = async (event) => {
    // if (!validateLocation(searchInput.value)) return;

    const forecast = await WeatherAPI.getForecast(searchInput.value);
    WeatherUI.loadCurrent(forecast);
  };

  // TODO:
  // Keyboard 'Enter' to search
  const attachEventHandlers = () => {
    searchInput.addEventListener("input", inputHandler);
    searchInput.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) searchHandler(e); // Keycode 13 = Enter
    });
  };

  return { attachEventHandlers };
})();

export { LocationSearch as default };
