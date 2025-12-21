const weatherInfo = document.querySelector(".weather-info");
const cityName = document.querySelector("#city");
const firstLine = document.querySelector("#firstLine");
const secondLine = document.querySelector("#secondLine");
const forecastInfo = document.querySelector("#forecast-info");
const moreInfo = document.querySelector("#more-info");
const dialog = document.querySelector("#dialogBox");
const forecastHead = document.querySelector("#forecast-head");

let forecastList;

const toggleDialog = (head, msg) => {
  if (!head) {
    dialog.close();
    return;
  }

  dialog.innerHTML = `
    <h2>${head}</h2>
    <p>${msg}</p>
    <button onclick="toggleDialog()">Close</button>
  `;
  dialog.showModal();
};

const updateWeather = (data) => {
  firstLine.textContent = `${Math.round(data.main.temp)}°C | ${data.weather[0].description}`;
  secondLine.textContent = `Humidity: ${data.main.humidity}% | Wind Speed: ${data.wind.speed}m/s`;
  cityName.textContent = `${data.name}'s Weather`;
};

const updateForecast = (data) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forecastList = "";

  data.list.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000);
    const day = days[date.getDay()];
    const time = `${date.getHours().toString().padStart(2, "0")}:00`;
    const minTemp = `${Math.round(forecast.main.temp_min).toString().padStart(2, " ")}°C`;
    const maxTemp = `${Math.round(forecast.main.temp_max).toString()}°C`.padEnd(4, " ");

    forecastList += `<li>${day} ${time} | ${minTemp}/${maxTemp} | ${forecast.weather[0].description}</li>`;
  });
  forecastInfo.innerHTML = forecastList;
};

const showMore = () => {
  if (!forecastList) return;
  moreInfo.innerHTML = forecastList;
  const children = moreInfo.children;

  for (let i = 0; i < 8; i++) {
    children[i].style.display = "none";
  }

  moreInfo.innerHTML += `<li><button onclick="showLess()">Show less</button></li>`;

  forecastHead.textContent = `Next 5 Days Forecast`;
};

const showLess = () => {
  moreInfo.innerHTML = `<li><button onclick="showMore()">Show more</button></li>`;
  forecastHead.textContent = `Next 24 Hours Forecast`;
};

const getWeather = async (e) => {
  e.preventDefault();
  const city = document.querySelector("#search-bar").value;
  if (!city) return toggleDialog("No city selected", "Please enter a city.");

  const res = await fetch(`/weather?city=${city}`);
  const data = await res.json();

  if (res.status === 404) {
    return toggleDialog("City not found", "Invalid city name");
  } else if (!res.ok) {
    throw new Error("Failed to get Weather");
  }

  localStorage.setItem("city", city);
  updateWeather(data);
  getForecast(city);
};

const getForecast = async (city) => {
  const res = await fetch(`/forecast?city=${city}`);
  const data = await res.json();

  if (res.status === 404) {
    return toggleDialog("City not found", "Invalid city name");
  } else if (!res.ok) {
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

    if (!res.ok) {
      throw new Error("Failed to get Weather");
    }

    updateWeather(data);
    getForecast(city);
  }
});
