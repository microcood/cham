import {Host, Guest} from './communicators.ts'

let ws = new WebSocket(window['WEBSOCKETS_URL'])

ws.onmessage = function(message) {
    console.log('received: ', message.data)
}

let host = new Host(ws)
host.createChannel('channel')

let guest = new Guest(ws)