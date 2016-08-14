var assignIn = require("lodash/assignIn")
var path = require("path")

var appSettings = {
    DEBUG: true,
    PORT: 8000,
    IP: "127.0.0.1",
    STATIC: path.join(__dirname + "/../fe"),
    WS_HOST: "localhost",
    WS_PORT: 8000
}

try {
    var localSettings = require("./localSettings")
    assignIn(appSettings, localSettings);
}
catch (e) { }

module.exports = appSettings