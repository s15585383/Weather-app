const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const cityName = searchInput.value.trim();
  if (cityName) {
    fetchWeatherData(cityName);
  }
});

function fetchWeatherData(cityName) {
  const url = `${baseUrl}?q=${cityName}&appid=${apiKey}&units=imperial`; // Using imperial units (Fahrenheit)

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

  // Implement search history logic here (optional)
}
