// Global variables
const apiKey = '30ced98bf7b47a3e0d5002206004e34b';

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
            const currentWeather = data.list;
            displayCurrentWeather(data.list[0]);

            const fiveDayForecast = currentWeather.filter(function (data) {
              return data.dt_txt.includes('12:00:00');
            });
           console.log(fiveDayForecast);

           for (let i = 0; i < fiveDayForecast.length; i++) {
            const day = fiveDayForecast[i];



          //   <div class="card">
          //   <div class="card-body">
          //     <h3 id="card-title"></h3>
          //     <img id="icon">
          //     <p id="temp"></p>
          //     <p id="wind"></p>
          //     <p id="humidity"></p>
          //   </div>
          // </div>

           }
        })
    })
};

function displayCurrentWeather(currentWeather) {
  const iconUrl = `https://openweathermap.org${currentWeather.weather.icon}.png` // TBC
  const icon = $('#icon').attr('src', iconUrl);
  const temp = $('#temp').text(`Temperature: ${currentWeather.main.temp} C`);
  const wind = $('#wind').text(`Wind: ${currentWeather.wind.speed} kph`);
  const humidity = $('#humidity').text(`Humidity: ${currentWeather.main.humidity} %`);
}




    $('#search-button').on('click', function(e) {
      e.preventDefault();

      const search = $('#search-input').val().trim();
      $('#today').attr('class', 'mt-3');
      fetchWeather(search);



    })



// Function to fetch weather data from Openweather API

    // Fetch image data from Pixabay

// Function to display the current weather of a city


// Function to display the 5-day forecast of the same city displayed in displayCurrentWeather()

  // Filter data to include only 12:00 forecast          

  // Empty forecast section to prevent duplication

    // Create elements

    
    // Print elements to page


// Function to add searched locations to local storage


  // Convert searchTerm to uppercase to prevent search history duplication


  // Check localstorage array for searchTerm, if it doesn't exist then push to array


// Function to display locations previously searched

  //Add button to clear search history


// // Function to clear searchHistory and localstorage
// // function clearSearchHistory() {


// Event listener on search button


  // Only run fetchWeather() if #search-input is not empty


// Event listener on prev-search button, load selected city current weather and 5 day forecast


// If searchHistory exists in localstorage, render search history to page on page load




    