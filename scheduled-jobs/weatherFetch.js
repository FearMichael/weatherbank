const axios = require("axios");
const fs = require("fs");
const Weather = require("../Models/weatherInfo");
require("dotenv").config();
let rawCities = fs.readFileSync("./cities.json");
let cities = JSON.parse(rawCities);
const logError = require("../Globals/logError");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

let runningSaves = 0;
//used for testing
// Weather.create(JSON.parse(fs.readFileSync("./mockData.json"))).then(() => runningSaves--);
const runFetch = () => {
    for (let i = 0; i < cities.length; i++) {
        runningSaves++;
        axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${cities[i].latitude},${cities[i].longitude}`).then((weatherData) => {
            runningSaves++;
            Weather.create(weatherData.data).then(() => runningSaves--).catch(() => runningSaves--);
        }).catch((err) => {
            runningSaves--
            logError(err);
            console.error(err);
        });
    };
}


function closeConnection() {
    console.log(runningSaves);
    if (runningSaves === 0) {
        mongoose.disconnect();
        console.log("Mongoose Disconnected.")
    } else {
        console.log("waiting to close");
        setTimeout(function () {
            closeConnection(runningSaves);
        }, 1000)
    }
};

runFetch();

closeConnection(runningSaves);


// module.exports = runFetch;