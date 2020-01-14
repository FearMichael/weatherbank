const fs = require("fs");
function logError(error) {
    let timeStamp = Date.now();
    let readableTime = Date(timeStamp);
    let log = `ERROR: ${error} | Time: ${readableTime} | Timestamp: ${timeStamp} \n`;
    fs.appendFileSync("../errorlog.txt", log);
};

module.exports = logError;