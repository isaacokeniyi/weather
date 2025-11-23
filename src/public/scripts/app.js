const weatherInfo = document.querySelector(".weather-info");
const city = document.querySelector("#city");
const temp = document.querySelector("#temp");
const description = document.querySelector("#description");
const minMax = document.querySelector("#minMax");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");

const updateWeather = (data) => {
  city.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = `${Math.round(data.main.temp)}°`;
  description.textContent = `${data.weather[0].description}`;
  minMax.textContent = `${Math.round(data.main.temp_min)}°/${Math.round(data.main.temp_max)}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind speed: ${data.wind.speed} m/s`;
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
};

window.onload = async () => {
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
};
