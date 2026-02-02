document.title = "Weather App";
const apiKey = "de6b614e1e502bab025b74ee1206193f";
const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-button");

const searchSection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");
const weatherSection = document.querySelector(".weather-info");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
async function getFetchData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  return "clouds.svg";
}

async function updateWeatherInfo(city) {
  const weatherInfo = await getFetchData("weather", city);
  if (weatherInfo.cod != 200) {
    displaymessege(notFoundSection);
    return;
  }

  // Update location data
  document.querySelector(".country-txt").textContent = weatherInfo.name;
  const currentDate = new Date();
  const options = { weekday: "short", month: "short", day: "numeric" };
  document.querySelector(".current-date-txt").textContent =
    currentDate.toLocaleDateString("en-US", options);

  // Update weather summary
  const weatherIcon = getWeatherIcon(weatherInfo.weather[0].id);
  document.querySelector(".weather-summary-img").src =
    `assets/weather/${weatherIcon}`;
  document.querySelector(".temp-text").textContent =
    `${Math.round(weatherInfo.main.temp)} °C`;
  document.querySelector(".condition-text").textContent =
    weatherInfo.weather[0].main;

  // Update weather conditions
  document.querySelector(".humidity-level").textContent =
    `${weatherInfo.main.humidity}%`;
  const windElements = document.querySelectorAll(".humidity-level");
  windElements[1].textContent = `${weatherInfo.wind.speed} M/s`;
  await updateForcastInfo(city);
  displaymessege(weatherSection);
}
async function updateForcastInfo(city) {
  const forcastData = await getFetchData("forecast", city);

  // Get unique dates for the next 4 days
  const forecastDates = {};
  forcastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });

    // Keep only one forecast per day (use the first one)
    if (!forecastDates[dateStr]) {
      forecastDates[dateStr] = item;
    }
  });

  // Get the first 4 unique days
  const forecastItems = Object.values(forecastDates).slice(0, 4);

  // Update the forecast items in the DOM
  const forecastContainer = document.querySelectorAll(".forcast-item");
  forecastContainer.forEach((item, index) => {
    if (forecastItems[index]) {
      const forecast = forecastItems[index];
      const date = new Date(forecast.dt * 1000);
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const icon = getWeatherIcon(forecast.weather[0].id);
      const temp = Math.round(forecast.main.temp);

      item.querySelector(".forcast-item-data:nth-of-type(1)").textContent =
        dateStr;
      item.querySelector("img").src = `assets/weather/${icon}`;
      item.querySelector(".forcast-item-data:nth-of-type(2)").textContent =
        `${temp} °C`;
    }
  });
}
function displaymessege(section) {
  [searchSection, notFoundSection, weatherSection].forEach((section) => {
    section.style.display = "none";
  });
  section.style.display = "flex";
}
