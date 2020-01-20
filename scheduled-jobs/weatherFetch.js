const axios = require("axios");
const fs = require("fs");
const Weather = require("../Models/weatherInfo");
require("dotenv").config();
const cities = JSON.parse(fs.readFileSync("./cities.json"));
const logError = require("../Globals/logError");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

//Kill process after 7 minutes
const maxRuntime = setTimeout(function () {
    console.error("Runtime Maxed Out - Killing process")
    mongoose.disconnect()
    process.exit(1);
    //7 minute timeout
}, (1000 * 60) * 7);

//Count how many items get saved to the database then disconnect from DB and end process once 1000 have been run
let savedItems = null;

const runFetch = () => {
    //loop over all cities and fetch their weather data
    for (let i = 0; i < cities.length; i++) {
        axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${cities[i].latitude},${cities[i].longitude}`).then((weatherData) => {
            //add weather data for the city to the DB
            Weather.create(weatherData.data).then(() => {
                //increment saved items forward upon successful completion
                savedItems++
                checkCloseConnection();
            }).catch(err => {
                //increment saved items forward even when failed but log the failure
                //this way the checkCloseFunction will still end after cities.length has been completed
                savedItems++
                checkCloseConnection();
                console.error(err);
            })
        }).catch(err => {
            savedItems++
            if (err.response.code === 403 || err.response.data.code === 403) {
                //if forbidden at DarkSky - most likely the API call limit has been reached, disconnect and terminate the process
                console.error("Exited on 403 error");
                mongoose.disconnect();
                process.exit(1);
            } else {
                checkCloseConnection();
            }
        })
    };
};

function checkCloseConnection() {
    if (savedItems === cities.length) {
        mongoose.disconnect();
        console.log("Mongoose Disconnected.");
        console.log("Successfully Completed");
        process.exit(0);
    };
};

runFetch();