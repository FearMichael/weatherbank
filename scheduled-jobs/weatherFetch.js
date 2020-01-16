const axios = require("axios");
const fs = require("fs");
const Weather = require("../Models/weatherInfo");
require("dotenv").config();
let rawCities = fs.readFileSync("./cities.json");
let cities = JSON.parse(rawCities);
const logError = require("../Globals/logError");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const runFetch = () => {
    for (let i = 0; i < cities.length; i++) {

        axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${cities[i].latitude},${cities[i].longitude}`).then((weatherData) => {
            Weather.create(weatherData.data);
        }).catch((err) => {
            logError(err);
            console.error(err);
        });
    };
}

runFetch();

// module.exports = runFetch;