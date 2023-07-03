const Weather = (function () {
  function generateURL(api, params) {
    const apiKey = "ee0be1659b65437bb2254148231306";
    const baseURL = "http://api.weatherapi.com/v1";

    let url = `${baseURL}/${api}.json?key=${apiKey}`;
    Object.entries(params).forEach(
      ([param, value]) => (url += `&${param}=${value}`)
    );

    return url;
  }

  async function fetchData(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async function getLocationSuggestions(query) {
    const locationsURL = generateURL("search", { q: query });
    return fetchData(locationsURL);
  }

  async function getCurrent(query, aqi = "no") {
    const currentURL = generateURL("current", { q: query, aqi });
    return fetchData(currentURL);
  }

  async function getForecast(query, aqi = "no", days = 1, alerts = "no") {
    const forecastURL = generateURL("forecast", {
      q: query,
      aqi,
      days,
      alerts,
    });
    return fetchData(forecastURL);
  }

  return { getLocationSuggestions, getCurrent, getForecast };
})();

export { Weather as default };
