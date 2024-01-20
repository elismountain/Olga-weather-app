// Global variables
const apiKey = '30ced98bf7b47a3e0d5002206004e34b';

function fetchWeather(search) {
  let queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  
  fetch(queryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        let latitude = data[0].lat;
        let longitude = data[0].lon;
        let forecastURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const h3El = $('#card-title').text(`${data[0].name} (${dayjs().format('MMMM D, YYYY')})`);

        fetch(forecastURl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            displayForecast(data);
        })
    })
};

function displayCurrentWeather(currentWeather) {
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` 
  const icon = $('#icon').attr('src', iconUrl);
  const temp = $('#temp').text(`Temperature: ${currentWeather.main.temp} °C`);
  const wind = $('#wind').text(`Wind: ${currentWeather.wind.speed} kph`);
  const humidity = $('#humidity').text(`Humidity: ${currentWeather.main.humidity} %`);
}

function displayForecast(data) {
  const currentWeather = data.list;
  displayCurrentWeather(data.list[0]);
            
  const fiveDayForecast = currentWeather.filter(function (data) {
    return data.dt_txt.includes('12:00:00');
  });

  $('#forecast').empty();

  for (let i = 0; i < fiveDayForecast.length; i++) {
    const day = fiveDayForecast[i];
    const cardCol = $('<div>').attr('class', 'col-md');
    const forecastCard = $('<div>').attr('class', 'card');
    const forecastBody = $('<div>').attr('class', 'card-body');
    const forecastIconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const forecastIcon = $('<img>').attr('src', forecastIconUrl);
    const forecastTitle = $('<h5>').attr('class', 'card-title').text(dayjs(day.dt_txt).format('DD-MM-YYYY')); // Year optional
    const forecastTemp = $('<p>').text(`Temp: ${day.main.temp} °C`);
    const forecastWind = $('<p>').text(`Wind: ${day.wind.speed} kph`);
    const forecastHumidity = $('<p>').text(`Humidity: ${day.main.humidity} %`);

    $('#forecast').append(cardCol);
    cardCol.append(forecastCard);
    forecastCard.append(forecastBody);
    forecastBody.append(forecastTitle, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
  }
}

// Function to display locations previously searched
function renderHistory() {
  $("#history").empty();
  let searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory'));

  for (let i = 0; i < searchHistoryArr.length; i++) {
    const prevSearch = searchHistoryArr[i];
    const a = $('<button>').addClass('prev-search btn btn-light mt-2').attr('data-name', prevSearch).text(prevSearch);
    $('#history').append(a);
  };
};

// Event listener on search button

$('#search-button').on('click', function(e) {
  e.preventDefault();
  const search = $('#search-input').val().trim();
  if (search) {
    $('#today').attr('class', 'mt-3');
    fetchWeather(search);  
  };
});

// Event listener on prev-search button, load selected city current weather and 5 day forecast
$('#history').on('click', '.prev-search', function() {
  const selectedBtn = $(this).text()
  fetchWeather(selectedBtn)
  $('#today').removeClass('hide')
});

// If searchHistory exists in localstorage, render search history to page on page load
$(function() {
  const isSearchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  if (isSearchHistory) {
    renderHistory();
  }  
});








    