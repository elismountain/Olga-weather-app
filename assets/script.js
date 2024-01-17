// Global variables
const apiKey = '30ced98bf7b47a3e0d5002206004e34b';
const searches = [];

// Function to fetch weather data fromm Openweather API
function fetchWeather(search) {
  let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  
  fetch(queryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(`geo data: ${data}`);
        let latitude = data[0].lat
        let longitude = data[0].lon
        let forecastURl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const h3El = $('#card-title').text(`${data[0].name} (${dayjs().format('MMMM D, YYYY')})`);

        fetch(forecastURl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            displayForecast(data);
            addSearchHistory(search);
        })
    })
};

// Function to display the current weather of a city
function displayCurrentWeather(currentWeather) {
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` 
  console.log(iconUrl)
  const icon = $('#icon').attr('src', iconUrl);
  const temp = $('#temp').text(`Temperature: ${currentWeather.main.temp} °C`);
  const wind = $('#wind').text(`Wind: ${currentWeather.wind.speed} kph`);
  const humidity = $('#humidity').text(`Humidity: ${currentWeather.main.humidity} %`);
};

// Function to display the 5-day forecast of the same city displayed in displayCurrentWeather()
function displayForecast(data) {
  const currentWeather = data.list;
  displayCurrentWeather(data.list[0]);
  // Filter data to include only 12:00 forecast          
  const fiveDayForecast = currentWeather.filter(function (data) {
    return data.dt_txt.includes('12:00:00');
  });
  console.log(fiveDayForecast);

  // Empty forecast section to prevent duplication
  $('#forecast').empty();

  for (let i = 0; i < fiveDayForecast.length; i++) {
    // Create elements
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
    
    // Print elements to page
    $('#forecast').append(cardCol);
    cardCol.append(forecastCard);
    forecastCard.append(forecastBody);
    forecastBody.append(forecastTitle, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
  }
};

function addSearchHistory(searchTerm) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(searchTerm);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  renderHistory(searchTerm);  
};

// Function for displaying previous search buttons
function renderHistory() {
  // Deletes the previous search buttons prior to adding new movies
  // (this is necessary otherwise you will have repeat buttons)
  $("#history").empty();

  let searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory'));

  console.log(`Search history array: ${searchHistoryArr}`);

  for (let i = 0; i < searchHistoryArr.length; i++) {
    const prevSearch = searchHistoryArr[i];
    const a = $("<button>").addClass('search').attr('data-name', prevSearch).text(prevSearch);
    $("#history").append(a);
  }
};

// Event listener on search button
$('#search-button').on('click', function(e) {
  e.preventDefault();
  const search = $('#search-input').val().trim();

  // Only run fetchWeather() if #search-input is not empty
  if (search) {
    $('#today').attr('class', 'mt-3');    
    fetchWeather(search);
  };
});






    