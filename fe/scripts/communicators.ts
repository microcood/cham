window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate

class Communicator {
    config: {
        iceServers: [{
            url: "stun:stun.l.google.com:19302"
        }, {
            url: "stun:stun1.l.google.com:19302"
        }, {
            url: "stun:stun2.l.google.com:19302"
        }, {
            url: "stun:stun3.l.google.com:19302"
        }]
    }
    connection: RTCPeerConnection
    channel: RTCDataChannel
    push: Function
    constructor(push) {
        this.connection = new RTCPeerConnection(this.config)
        this.setConnectionEvents()
        this.push = push
    }
    setChannelEvents() {
        this.channel.onmessage = event => console.log(event.data)
        this.channel.onopen = event => console.log(this.channel.label + ' is open')
        this.channel.onclose = event => console.log(this.channel.label + ' is closed')
    }
    setConnectionEvents() {
        this.connection.onicecandidate = (event) => {
            if (event.candidate) {
                this.push({
                    candidate: event.candidate
                })
            }
        }
    }
    addIceCandidate(candidate) {
        let iceCandidate = new RTCIceCandidate({
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate
        })
        this.connection.addIceCandidate(iceCandidate)
    }
    descriptionHandler(sdp) {
        this.connection.setLocalDescription(sdp)
        this.push({
            sdp: sdp
        })
    }
    setRemoteDescription(sdp) {
        let sessionDescription = new RTCSessionDescription(sdp)
        this.connection.setRemoteDescription(sessionDescription)
    }
}

export class Host extends Communicator {
    createChannel(label) {
        this.channel = this.connection.createDataChannel(label, {
            ordered: true
        })
        this.setChannelEvents()
        this.connection.createOffer(this.descriptionHandler.bind(this), function () {
            console.log('error', arguments)
        })
    }
}

export class Guest extends Communicator {
    createAnswer(sdp) {
        this.setRemoteDescription(sdp)
        this.connection.createAnswer(this.descriptionHandler.bind(this), function () {
            console.log('error', arguments)
        })
    }
    setConnectionEvents() {
        super.setConnectionEvents()
        this.connection.ondatachannel = (event) => {
            this.channel = event.channel
            this.setChannelEvents()
        }
    }
}