const axios = require("axios");
const fs = require("fs");
const Weather = require("../Models/weatherInfo");
require("dotenv").config();
const rawCities = JSON.parse(fs.readFileSync("./cities.json"));
const logError = require("../Globals/logError");
const mongoose = require("mongoose");
const _ = require("lodash");

// mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(function () {



//Kill process after 7 minutes
const maxRuntime = setTimeout(function () {
    console.error("Runtime Maxed Out - Killing process")
    mongoose.disconnect()
    process.exit(1);
    //7 minute timeout
}, (1000 * 60) * 7);

//Count how many items get saved to the database then disconnect from DB and end process once 1000 have been run
let savedItems = null;

const cities = _.chunk(rawCities, 25);
console.log(cities.length);



///callable function to loop over data

const getWeather = (locations) => {
    let promises = [];

    locations.forEach((location) => {
        promises.push(axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${location.latitude},${location.longitude}`));
    });

    let weatherData = [];

    Promise.all(promises)
        .then((data) => {
            console.log(data.data);
            data.forEach((weather) => {
                weatherData.push(Weather.create(weather.data));
            });
            return Promise.all(weatherData);
        }).then(function (data) {

            promiseLoop(cities);

        }).catch(err => {
            mongoose.disconnect();
            console.log("Error with getting and creating weather data!", err);
            process.exit(1);
        });
}

const iteration = {
    count: 0,
    getCount: function () {
        return this.count;
    },
    setCount: function (newVal) {
        return this.count = newVal;
    },
    incrementCount: function () {
        return this.count += 1;
    }

};

//application function to loop over all arrays and calls 

const promiseLoop = (nestedArr) => {
    if (iteration.getCount() < nestedArr.length) {
        // setTimeout(function () {
        getWeather(nestedArr[iteration]);
        promiseLoop(nestedArr);
        iteration.incrementCount();
        // }, 1000);
    } else {
        // setTimeout(function () {
        console.log("Exiting .. Completed.")
        process.exit(0);
        // }, 5000);
    }
};

promiseLoop(cities);

// console.table(cities[0]);
// getWeather(cities[0]);

// const runFetch = async () => {
//     //loop over all cities and fetch their weather data
//     for (let i = 0; i < cities.length; i++) {
//         try {

//             let weatherData = await axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${cities[i].latitude},${cities[i].longitude}`)
//             //add weather data for the city to the DB
//             await Weather.create(weatherData.data);
//             //increment saved items forward upon successful completion
//             savedItems++

//         } catch (err) {
//             if (err.response.code === 403 || err.response.data.code === 403) {
//                 //if forbidden at DarkSky - most likely the API call limit has been reached, disconnect and terminate the process
//                 console.error("Exited on 403 error");
//                 mongoose.disconnect();
//                 process.exit(1);
//             } else {
//                 savedItems++;
//                 checkCloseConnection();
//             }
//         }
//     }
//     checkCloseConnection();
// };

function checkCloseConnection() {
    if (savedItems === cities.length) {
        mongoose.disconnect();
        console.log("Mongoose Disconnected.");
        console.log("Successfully Completed");
        process.exit(0);
    };
};

// if (process.argv[2] === "run") {
//     runFetch();
// } else {
//     console.error("Add 'run' to your command")
//     process.exit(1);
// }

// }).catch (err => {
//     console.log(err)
//     process.exit(1)
// });