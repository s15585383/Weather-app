// const apiKey = "2c4302b98fb4d16a55d7c64a8f3f04d3";
// const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
// const geocodingApiUrl = "https://api.openweathermap.org/geo/1.1/q";

// const searchInput = document.getElementById("city-search");
// const searchButton = document.getElementById("search-button");

// function geocodeCity(cityName, countryCode = "") {
//   const url = `${geocodingApiUrl}?q=${cityName}${
//     countryCode ? `,${countryCode}` : ""
//   }&appid=${apiKey}`;

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.cod === "200") {
//         // Success response
//         const coordinates = data.coords; // Extract coordinates (latitude & longitude)
//         fetchWeatherData(coordinates.lat, coordinates.lon); // Call weather data fetch function with coordinates
//       } else {
//         console.error("Geocoding error:", data.message); // Handle geocoding errors
//       }
//     })
//     .catch((error) => console.error("Geocoding API error:", error));
// }

// searchButton.addEventListener("click", (event) => {
//   event.preventDefault();

//   const cityName = searchInput.value.trim();
//   const countryCode =
//     document.getElementById("country-code").value.toUpperCase() || ""; // Optional country code input

//   geocodeCity(cityName, countryCode);
// });

// function fetchWeatherData(lat, lon) {
//   const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
//   const url = `${weatherApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; // Using imperial units (Fahrenheit)

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => displayWeatherData(data))
//     .catch((error) => console.error(error));
// }

// function displayWeatherData(weatherData) {
//   const cityName = weatherData.name;
//   const date = new Date(weatherData.dt * 1000).toLocaleDateString();
//   const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
//   const temperature = Math.floor(weatherData.main.temp);
//   const humidity = weatherData.main.humidity;
//   const windSpeed = weatherData.wind.speed;

//   // Update HTML elements with weather information
//   document.getElementById("city-name").textContent = cityName;
//   document.getElementById("date").textContent = date;
//   document.getElementById("weather-icon").src = weatherIcon;
//   document.getElementById("temperature").textContent = `${temperature}°F`;
//   document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
//   document.getElementById(
//     "wind-speed"
//   ).textContent = `Wind Speed: ${windSpeed} mph`;
// }
// const apiKey = "2c4302b98fb4d16a55d7c64a8f3f04d3";
const apiKey = "2c4302b98fb4d16a55d7c64a8f3f04d3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const searchInput = $("#city-search"); // Select the search input element
const searchButton = $("#search-button"); // Select the search button element
const cityNameElement = $("#city-name"); // Select the element for displaying city name
const currentDateElement = $("#current-date"); // Select the element for displaying current date
const temperatureElement = $("#temperature"); // Select the element for displaying temperature
const windElement = $("#wind"); // Select the element for displaying wind speed
const humidityElement = $("#humidity"); // Select the element for displaying humidity
const forecastCardsElement = $("#forecast-cards"); // Select the element for displaying forecast cards

const searchCity = () => {
  const cityName = searchInput.val().trim(); // Get trimmed city name from input
  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  fetch(`${baseUrl}?q=${cityName}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "404") {
        alert("City not found. Please try again.");
        return;
      }
      updateCurrentWeather(data);
      storeSearchedCity(cityName);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => console.error("Error fetching weather data:", error));
};

const updateCurrentWeather = (data) => {
  cityNameElement.text(data.name);
  currentDateElement.text(new Date(data.dt * 1000).toLocaleDateString());
  temperatureElement.text(
    `Temperature: ${Math.floor(data.main.temp - 273.15)}°C`
  );
  windElement.text(`Wind Speed: ${data.wind.speed} m/s`);
  humidityElement.text(`Humidity: ${data.main.humidity}%`);
};

const storeSearchedCity = (cityName) => {
  const existingCities =
    JSON.parse(localStorage.getItem("searchedCities")) || [];
  if (!existingCities.includes(cityName)) {
    existingCities.push(cityName);
    localStorage.setItem("searchedCities", JSON.stringify(existingCities));
    displaySearchedCities();
  }
};

const displaySearchedCities = () => {
  const searchedCities =
    JSON.parse(localStorage.getItem("searchedCities")) || [];
  $("#searched-cities").empty(); // Clear existing list items

  searchedCities.forEach((city) => {
    const listItem = $("<li>").addClass("list-group-item").text(city);
    listItem.click(() => {
      $("#city-search").val(city); // Pre-fill input with clicked city
      searchCity();
    });
    $("#searched-cities").append(listItem);
  });
};

const getForecast = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=<span class="math-inline">\{lat\}&lon\=</span>{lon}&exclude=current,minutely,hourly&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.daily.slice(1, 6); // Get data for next 5 days
      displayForecast(forecastData);
    })
    .catch((error) => console.error("Error fetching forecast data:", error));
};
const displayForecast = (forecastData) => {
  $("#forecast-cards").empty(); // Clear existing forecast cards

  forecastData.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const highTemp = Math.floor(day.temp.max - 273.15); // Convert Kelvin to Celsius
    const lowTemp = Math.floor(day.temp.min - 273.15);

    const forecastCard = $(`
      <div class="col-md-2 mb-2">
        <div class="card text-center">
          <div class="card-body">
            <p class="card-title">${date}</p>
            <img src="${iconUrl}" alt="${day.weather[0].main}">
            <p>High: ${highTemp}°C</p>
            <p>Low: ${lowTemp}°C</p>
          </div>
        </div>
      </div>
    `);

    $("#forecast-cards").append(forecastCard);
  });
};

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const cityName = searchInput.value.trim();
  const countryCode =
    document.getElementById("country-code").value.toUpperCase() || "";

  geocodeCity(cityName, countryCode);
});
