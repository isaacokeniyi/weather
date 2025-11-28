const weatherInfo = document.querySelector(".weather-info");
const cityName = document.querySelector("#city");
const firstLine = document.querySelector("#firstLine");
const secondLine = document.querySelector("#secondLine");
const forecastLists = document.querySelectorAll("#forecast-info li");

const updateWeather = (data) => {
  firstLine.textContent = `${Math.round(data.main.temp)}°C | ${data.weather[0].description}`;
  secondLine.textContent = `Humidity: ${data.main.humidity}% | Wind Speed: ${data.wind.speed}m/s`;
  cityName.textContent = `${data.name}'s Weather`;
};

const updateForecast = (data) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  data.list.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000);
    const day = days[date.getDay()];
    console.log(day);
  });
};

const getWeather = async (e) => {
  e.preventDefault();
  const city = document.querySelector("#search-bar").value;
  if (!city) return alert("Input a city");

  const res = await fetch(`/weather?city=${city}`);
  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error("Failed to get Weather");
  }

  localStorage.setItem("city", city);
  updateWeather(data);
  getForecast(city);
};

const getForecast = async (city) => {
  const res = await fetch(`/forecast?city=${city}`);
  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error("Failed to get Weather");
  }

  updateForecast(data);
};

window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service worker registered");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }
});

window.addEventListener("load", async () => {
  const city = localStorage.getItem("city");
  if (city) {
    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error("Failed to get Weather");
    }

    updateWeather(data);
  }
});
