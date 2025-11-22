const weatherInfo = document.querySelector(".weather-info");

const getWeather = async (e) => {
  e.preventDefault();
  const city = document.querySelector("#search-bar").value;

  if (!city) return alert("Input a city");

  const res = await fetch(`/weather?city=${city}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to get Weather");
  }

  weatherInfo.innerHTML = `
          <h2>${data.name}</h2>
          <p><strong>${data.main.temp}°C</strong></p>
          <p>${data.weather[0].description}</p>
          <p>${data.main.temp_min}°/${data.main.temp_max}°C</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
          `;
};
