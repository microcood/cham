var http = require("http")
var path = require("path")
var fs = require("fs")
var wsock = require("ws")
var express = require("express")
var nunjucks = require("nunjucks")

var settings = require("./be/settings")

var app = express()

app.use('/scripts/', express.static(settings.STATIC + "/scripts/"));

nunjucks.configure('fe/templates', {
    express: app
})

app.get('/', (req, res) => {
    res.render("index.html",  {
        WEBSOCKETS_URL: `ws:${settings.WS_HOST}:${settings.WS_PORT}`
    })
})

var httpServer = http.createServer(app);
httpServer.listen(settings.PORT, settings.IP)

var WebSocketServer = wsock.Server
var wss = new WebSocketServer({
    server: httpServer,
    autoAcceptConnections: false
})

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: ' + message)
    })

    ws.send('hello world')
})