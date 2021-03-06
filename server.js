require("dotenv").config();
const express = require("express");
const app = express();
// const weatherFetch = require("./scheduled-jobs/weatherFetch");
const mongoose = require("mongoose");
const cron = require("node-cron");
const logError = require("./Globals/logError.js");
const Weather = require("./Models/weatherInfo");


const PORT = process.env.PORT || 3000;
// try {

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).catch(err => console.log(err));

// console.log(process.env.MONGO_URI);

// let weatherSearch = cron.schedule("0 30 19 * * *", () => {
//     weatherFetch();
// }, {

// });
// weatherSearch.start();
//     // weatherFetch();
// } catch (err) {
//     logError(err);
// }

app.get("/api/allweather", async function (req, res) {
    let weather;
    try {
        weather = await Weather.find({}).limit(100);
        res.json(weather);
    } catch (err) {
        console.log(err);
        res.statusCode(500);
    }

})

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// })

app.listen(PORT, function () {
    console.log(`Listning on ${PORT}`)
})