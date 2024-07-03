const apiKey = "2c4302b98fb4d16a55d7c64a8f3f04d3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const geocodingApiUrl = "https://api.openweathermap.org/geo/1.1/q";

const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-button");

function geocodeCity(cityName, countryCode = "") {
  const url = `${geocodingApiUrl}?q=${cityName}${
    countryCode ? `,${countryCode}` : ""
  }&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "200") {
        // Success response
        const coordinates = data.coords; // Extract coordinates (latitude & longitude)
        fetchWeatherData(coordinates.lat, coordinates.lon); // Call weather data fetch function with coordinates
      } else {
        console.error("Geocoding error:", data.message); // Handle geocoding errors
      }
    })
    .catch((error) => console.error("Geocoding API error:", error));
}

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const cityName = searchInput.value.trim();
  const countryCode =
    document.getElementById("country-code").value.toUpperCase() || ""; // Optional country code input

  geocodeCity(cityName, countryCode);
});

function fetchWeatherData(lat, lon) {
  const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
  const url = `${weatherApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; // Using imperial units (Fahrenheit)

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayWeatherData(data))
    .catch((error) => console.error(error));
}

function displayWeatherData(weatherData) {
  const cityName = weatherData.name;
  const date = new Date(weatherData.dt * 1000).toLocaleDateString();
  const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const temperature = Math.floor(weatherData.main.temp);
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  // Update HTML elements with weather information
  document.getElementById("city-name").textContent = cityName;
  document.getElementById("date").textContent = date;
  document.getElementById("weather-icon").src = weatherIcon;
  document.getElementById("temperature").textContent = `${temperature}°F`;
  document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
  document.getElementById(
    "wind-speed"
  ).textContent = `Wind Speed: ${windSpeed} mph`;
}
