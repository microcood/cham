var assignIn = require("lodash/assignIn")
var path = require("path")

var appSettings = {
    DEBUG: true,
    PORT: 8000,
    IP: "0.0.0.0",
    STATIC: path.join(__dirname + "/../fe")
}

try {
    var localSettings = require("./localSettings")
    assignIn(appSettings, localSettings);
}
catch (e) { }

module.exports = appSettings