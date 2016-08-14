let ws = new WebSocket(window['WEBSOCKETS_URL'])

ws.onmessage = function(message) {
    console.log('received: ', message.data)
}