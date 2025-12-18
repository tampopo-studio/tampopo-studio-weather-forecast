function refreshWeather(response) {
  let temperatureToDisplay = document.querySelector("#temperature");
  let newTemperature = response.data.temperature.current;

  let cityToDisplay = document.querySelector("#city-name");
  let countryToDisplay = document.querySelector("#country-name");
  let descriptionToDisplay = document.querySelector("#description");
  let humidityToDisplay = document.querySelector("#humidity");
  let windSpeedToDisplay = document.querySelector("#wind-speed");
  let newWindSpeed = Math.round(response.data.wind.speed);

  let dayToDisplay = document.querySelector("#today");
  let timeAndDateToDisplay = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);

  let iconToDisplay = document.querySelector("#icon");

  cityToDisplay.innerHTML = response.data.city;
  countryToDisplay.innerHTML = response.data.country;
  dayToDisplay.innerHTML = findDay(date);
  timeAndDateToDisplay.innerHTML = formatDateAndTime(date);
  windSpeedToDisplay.innerHTML = `${newWindSpeed}KM/H`;
  humidityToDisplay.innerHTML = `${response.data.temperature.humidity}%`;
  descriptionToDisplay.innerHTML = response.data.condition.description;

  temperatureToDisplay.innerHTML = Math.round(newTemperature);
  iconToDisplay.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-icon" />`;

  getForecast(response.data.city);
}

function formatDateAndTime(date) {
  let year = date.getFullYear();
  let month = 1 + date.getMonth();
  let actualDate = date.getDate();
  let minutes = date.getMinutes();
  let hours = date.getHours();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  if (actualDate < 10) {
    actualDate = `0${actualDate}`;
  }

  return `${actualDate}/${month}/${year} ${hours}:${minutes}`;
}

function findDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let newDay = days[date.getDay()];

  return newDay;
}

function searchCity(city) {
  let apiKey = "027a944a8237bdeb2dcbfffteb55oca7";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function searchEnteredCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#text-field");

  searchCity(newCity.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000 + 1);
  console.log(date);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = `027a944a8237bdeb2dcbfffteb55oca7`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
<div class="weather-forecast-day">
        <div class="forecast-date">${formatDay(day.time)}</div>
        <div class="forecast-icon"><img src=${day.condition.icon_url}></div>
        <div class="forecast-temperatures">
          <div class="forecast-maxtemp">${Math.round(
            day.temperature.maximum
          )}°</div><span>/</span>
          <div class="forecast-mintemp">${Math.round(
            day.temperature.minimum
          )}°</div>
        </div>
      </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let city = document.querySelector("#search-form");
city.addEventListener("submit", searchEnteredCity);

searchCity("Tokyo");
