import Weather from "./weatherapi";

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

    const locationSuggestions = await Weather.getLocationSuggestions(input);
    populateLocationOptions(locationSuggestions);
  };

  const attachEventHandlers = () => {

    searchInput.addEventListener("input", inputHandler);
  };

  return { attachEventHandlers };
})();

export { LocationSearch as default };
