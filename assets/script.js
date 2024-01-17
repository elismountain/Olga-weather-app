// Global variables
const apiKey = '30ced98bf7b47a3e0d5002206004e34b';
// Function to fetch weather data from Openweather API
function fetchWeather(search) {
  let queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  $('#search-input').val('');

  fetch(queryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        let latitude = data[0].lat
        let longitude = data[0].lon
        let forecastURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const h3El = $('#card-title').text(`${data[0].name} (${dayjs().format('MMMM D, YYYY')})`);

        fetch(forecastURl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            displayForecast(data);
            addSearchHistory(search);
        })
    });

    const pixabayKey = `41840177-083bd3031be52d22c24f809f7`;    
    const pixabayURL = `https://pixabay.com/api/?key=${pixabayKey}&q=${search}&image_type=photo`;

    // Fetch image data from Pixabay
    fetch(pixabayURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const locationImg = data.hits[0].largeImageURL;
        $('body').css({'background-image': `url(${locationImg})`, 'background-size': 'cover'});
      });
};

// Function to display the current weather of a city
function displayCurrentWeather(currentWeather) {
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` 
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
  
  // Empty forecast section to prevent duplication
  $('#forecast').empty();
  const forecastHeader = $('<h3>').text('5-Day Forecast:').addClass('mb-3');
  $('#forecast').prepend(forecastHeader);
  
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

// Function to add searched locations to local storage
function addSearchHistory(searchTerm) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Convert searchTerm to uppercase to prevent search history duplication
  searchTerm = searchTerm.toUpperCase();

  // Check localstorage array for searchTerm, if it doesn't exist then push to array
  if (searchHistory.includes(searchTerm) === false) {
    searchHistory.push(searchTerm);  
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderHistory(searchTerm);  
  }  
};

// Function to display locations previously searched
function renderHistory() {
  $("#history").empty();
  let searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory'));

  for (let i = 0; i < searchHistoryArr.length; i++) {
    const prevSearch = searchHistoryArr[i];
    const a = $('<button>').addClass('prev-search btn btn-light mt-2').attr('data-name', prevSearch).text(prevSearch);
    $('#history').append(a);
  };
  //Add button to clear search history
  // let clearBtn = $('<button>').addClass('clearBtn btn btn-info').text('Clear search history');
  // $('#history').append(clearBtn);
};

// // Function to clear searchHistory and localstorage
// // function clearSearchHistory() {
//   $('.clearBtn').on('click', function() {
//     console.log('CLEAR CLEAR CLEAR');
//     $('#history').empty(); // Clear search history from page
//     localStorage.clear(); // Empty localstorage
//   });
// // };

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



    