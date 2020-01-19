const axios = require("axios");
const fs = require("fs");
const Weather = require("../Models/weatherInfo");
require("dotenv").config();
const rawCities = fs.readFileSync("./cities.json");
const cities = JSON.parse(rawCities);
const logError = require("../Globals/logError");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

let runningSaves = null;
//used for testing
const runFetch = async () => {
    // runningSaves++;
    // Weather.create(JSON.parse(fs.readFileSync("./mockData.json"))).then(() => runningSaves--);
    for (let i = 0; i < 2; i++) {
        try {
            let weatherData = await axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${cities[i].latitude},${cities[i].longitude}`);
            runningSaves++;
            await Weather.create(weatherData.data)
            runningSaves--;
        } catch (err) {
            runningSaves--;
            if (err.response.code === 403 || err.response.data.code === 403) {
                console.log("Exited");
                process.exit(1);
            }
        }
    };
    closeConnection();
}


function closeConnection() {
    console.log(runningSaves);
    if (runningSaves > 0) {
        mongoose.disconnect();
        console.log("Mongoose Disconnected.");
    } else {
        console.log("Waiting to Close");
        setTimeout(function () {
            closeConnection(runningSaves);
        }, 1000)
    }
};

runFetch();