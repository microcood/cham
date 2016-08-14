var http = require("http")
var path = require("path")
var fs = require("fs")
var uws = require("uws")

var settings = require("./be/settings")

var httpServer = http.createServer(function (request, response) {
    console.log(request.url)
    var filename = "/templates/index.html";
    if (path.extname(request.url)) {
        filename = request.url;
    }
    if (!fs.existsSync(settings.STATIC + filename)) {
        response.writeHead(404);
        response.end();
        return;
    }
    fs.readFile(settings.STATIC + filename, "binary", function (err, file) {
        if (err) {
            response.writeHead(500);
            response.end();
            return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
    });
});
httpServer.listen(settings.PORT, settings.IP);

var WebSocketServer = uws.Server;
var wss = new WebSocketServer({
    server: httpServer,
    autoAcceptConnections: false
});

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: ' + message);
    });

    ws.send('hello world');
});