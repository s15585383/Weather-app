const apiKey = "bfbd4cc44a5e7d0b7b18e693777f0e45";
const baseUrl =
  "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}";

const searchCityInput = $("#city-search"); // Select the search input element
const searchCityBtn = $("#search-btn"); // Select the search button element
const cityNameElement = $("#city-name"); // Select the element for displaying city name
const currentDateElement = $("#current-date"); // Select the element for displaying current date
const temperatureElement = $("#temperature"); // Select the element for displaying temperature
const windElement = $("#wind"); // Select the element for displaying wind speed
const humidityElement = $("#humidity"); // Select the element for displaying humidity
const forecastCardsElement = $("#forecast-cards"); // Select the element for displaying forecast cards

const searchCity = () => {
  const cityName = searchCityInput.val().trim();
  if (!cityName) {
    alert("Please enter a city name");
    return;
  }
  console.log(`${baseUrl}?q=${cityName}&appid=${apiKey}`);
  fetch(`${baseUrl}?q=${cityName}&appid=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found. Please try again.");
      }
      return response.json();
    })
    .then((data) => {
      updateCurrentWeather(data);
      storeSearchedCity(cityName);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => console.error("Error fetching weather data:", error));

  // Display the city on the page
  const cityList = document.getElementById("cityList");
  const cityItem = document.createElement("li");
  cityItem.textContent = cityName;
  cityList.appendChild(cityItem);

  // Store the city in local storage
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.push(cityName);
  localStorage.setItem("cities", JSON.stringify(cities));
};

searchCityBtn.on("click", (event) => {
  event.preventDefault();

  const cityName = searchCityInput.val().trim();
  searchCity(cityName);
  console.log(cityName);
});

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
      searchCity(); // Call the function to search for the clicked city
    });
    $("#searched-cities").append(listItem);
  });
};

const addCityToSearchHistory = (cityName) => {
  addCityToSearchHistory("Paris");
  addCityToSearchHistory("London");
  addCityToSearchHistory("New York");
  storeSearchedCity(cityName);
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
  console.log("Forecast Data:", forecastData); // Check the forecast data received

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

    $("#forecast-cards").append(forecastCard); // Append each forecast card to the forecast-cards element
  });
};
let searchedCities = [];

const getCityForecast = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      getForecast(lat, lon);
    })
    .catch((error) =>
      console.error("Error fetching city forecast data:", error)
    );
};

const displaySearchHistory = () => {
  const searchHistoryElement = $("#search-history");
  searchHistoryElement.empty(); // Clear existing search history

  searchedCities.forEach((city) => {
    const cityElement = $(`<div class="searched-city">${city}</div>`);
    cityElement.on("click", () => {
      getCityForecast(city); // Fetch and display weather data for the clicked city
    });
    searchHistoryElement.append(cityElement);
  });
};

// Example usage: Add a city to the search history
searchedCities.push("Paris");
searchedCities.push("New York");
searchedCities.push("London");
displaySearchHistory(); // Display the search history with clickable city names

function handleCityButtonClick(event) {
  // Get the city name from the clicked button
  const cityName = event.target.innerText;

  // Perform actions based on the clicked city, such as displaying more information
  console.log(`City button clicked: ${cityName}`);
}

// Add event listeners to each city button
const cityButtons = document.querySelectorAll(".city-btn");

cityButtons.forEach((button) => {
  button.addEventListener("click", handleCityButtonClick);
});
