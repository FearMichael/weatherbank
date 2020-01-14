const express = require("express");
const app = express();
const weatherFetch = require("./scheduled-jobs/weatherFetch");
const mongoose = require("mongoose");
const cron = require("node-cron");
const logError = require("./Globals/logError.js");


const PORT = 3001;
try {

    mongoose.connect(process.env.MONGO_URI);


    let weatherSearch = cron.schedule("0 * 4 * * *", () => {
        weatherFetch();
    }, {

    });
    weatherSearch.start();
    // weatherFetch();
} catch (err) {
    logError(err);
}

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.listen(PORT, function () {
    console.log(`Listning on ${PORT}`)
})