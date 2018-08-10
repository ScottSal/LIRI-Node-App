require("dotenv").config();
// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");
// Import the API keys
var keys = require("./keys");
// Import the request npm package.
var request = require("request");
// Import the FS package for read/write.
var fs = require("fs");
// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// Writes to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};
// Function for running a Spotify search
var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "The Zephyr Song";
    }
    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log("-----------------------------------");
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

// Function for running a Movie Search
var getMeMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "Mr Nobody";
    }
    var urlHit =
      "http://www.omdbapi.com/?t=" +
      movieName +
      "&y=&plot=full&tomatoes=true&apikey=trilogy";
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
        console.log("-----------------------------------");
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
        console.log("-----------------------------------");
      }
    });
  };

// Function for running a Weather Search
function getWeather(city) {
    if (process.argv[3]) {
      city = '';
      process.argv.forEach((arg, index) => {
        if (index >= 3) {
          city += arg + ' ';
        }
      });
    } else if (!city) {
      city = 'Dallas ';
    }
    city = city.slice(0, -1);
    const owmURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${owmApiKey}`;
    request(owmURL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);
        console.log("-----------------------------------");
        console.log('Here is the current weather in ' + city + ':');
        console.log(' ');
        console.log(body.weather[0].description);
        console.log(' ');
        console.log(Math.round(body.main.temp) + '°F');
        console.log(' ');
        const dataToAppend = `Here is the current weather in ${city}: ${
          body.weather[0].description
        }, ${body.main.temp}°F}`;
        fs.appendFile('log.txt', dataToAppend, err => {
          if (err) throw err;
          console.log('The weather data was appended to log.txt!');
          console.log("-----------------------------------");
        });
      } 
    });
  }

// Function for running a command based on text file
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};
// Function for determining which command is executed
var pick = function (caseData, functionData) {
    switch (caseData) {
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMeMovie(functionData);
            break;
        case 'get-weather':
            getWeather(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI doesn't know that");
    }
};
// Function which takes in command line arguments and executes correct function accordigly
var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};
// MAIN PROCESS
// =====================================
runThis(process.argv[2], process.argv[3]);
