let ws = new WebSocket(`ws:${window.location.host}`)

ws.onmessage = function(message) {
    console.log('received: ', message.data)
}