const Mongoose = require("mongoose");

const minutely = {
    time: String,
    precipIntensity: String,
    precipProbability: String,
    precipIntensityError: Number,
    precipType: String
}

const hourly =
{
    "time": Number,
    "summary": String,
    "icon": String,
    "precipIntensity": Number,
    "precipProbability": Number,
    "precipType": String,
    "temperature": Number,
    "apparentTemperature": Number,
    "dewPoint": Number,
    "humidity": Number,
    "pressure": Number,
    "windSpeed": Number,
    "windGust": Number,
    "windBearing": Number,
    "cloudCover": Number,
    "uvIndex": Number,
    "visibility": Number,
    "ozone": Number
}

const daily = {
    "time": Number,
    "summary": String,
    "icon": String,
    "sunriseTime": Number,
    "sunsetTime": Number,
    "moonPhase": Number,
    "precipIntensity": Number,
    "precipIntensityMax": Number,
    "precipIntensityMaxTime": Number,
    "precipProbability": Number,
    "precipType": String,
    "temperatureHigh": Number,
    "temperatureHighTime": Number,
    "temperatureLow": Number,
    "temperatureLowTime": Number,
    "apparentTemperatureHigh": Number,
    "apparentTemperatureHighTime": Number,
    "apparentTemperatureLow": Number,
    "apparentTemperatureLowTime": Number,
    "dewPoint": Number,
    "humidity": Number,
    "pressure": Number,
    "windSpeed": Number,
    "windGust": Number,
    "windGustTime": Number,
    "windBearing": Number,
    "cloudCover": Number,
    "uvIndex": Number,
    "uvIndexTime": Number,
    "visibility": Number,
    "ozone": Number,
    "temperatureMin": Number,
    "temperatureMinTime": Number,
    "temperatureMax": Number,
    "temperatureMaxTime": Number,
    "apparentTemperatureMin": Number,
    "apparentTemperatureMinTime": Number,
    "apparentTemperatureMax": Number,
    "apparentTemperatureMaxTime": Number
}

const WeatherInfo = Mongoose.Schema({

    "latitude": Number,
    "longitude": Number,
    "timezone": String,
    "currently": {
        "time": Number,
        "summary": String,
        "icon": String,
        "nearestStormDistance": Number,
        "precipIntensity": Number,
        "precipProbability": Number,
        "temperature": Number,
        "apparentTemperature": Number,
        "dewPoint": Number,
        "humidity": Number,
        "pressure": Number,
        "windSpeed": Number,
        "windGust": Number,
        "windBearing": Number,
        "cloudCover": Number,
        "uvIndex": Number,
        "visibility": Number,
        "ozone": Number
    },
    "minutely": {
        "summary": String,
        "icon": String,
        "data": [minutely]
    },
    "hourly": {
        "summary": String,
        "icon": String,
        "data": [hourly]
    },
    "daily": {
        "summary": String,
        "icon": String,
        "data": [daily]
    },
    "flags": {
        "sources": [String],
        "nearest-station": Number,
        "units": String
    },
    "offset": Number
})

module.exports = Mongoose.model("Weather", WeatherInfo);
