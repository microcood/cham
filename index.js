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
    express: app,
    noCache: settings.DEBUG
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


let wsConnections = []

wss.on('connection', (ws) => {
    wsConnections.push(ws)
    ws.on('message', (message) => {
        console.log('received: ' + message)
        wsConnections.forEach((w) => {
            if (w.readyState == w.OPEN) {
                w.send(message)
            }
        })
    })
})