# react-native-simple-peer

To building Simple WebRTC video, voice, and data channels through peer-to-peer WebRTC-based mobile Application

## features

- concise, **node.js style** API for [WebRTC](https://en.wikipedia.org/wiki/WebRTC)
- **works in node and the browser!**
- supports **video/voice streams**
- supports **data channel**
  - text and binary data
  - node.js [duplex stream](http://nodejs.org/api/stream.html) interface
- supports advanced options like:
  - enable/disable [trickle ICE candidates](http://webrtchacks.com/trickle-ice/)
  - manually set config options
  - transceivers and renegotiation

## Example Source Codes
- [React Native](example)
- [Live socket Server](https://meet-app-video.herokuapp.com)

## Installation

### NPM

```sh
npm install react-native-simple-peer
```

### Yarn

```sh
 yarn add react-native-simple-peer
```

## Usage


### A simpler example

This example create two peers **in the same page**.

### data channels

```js
import RNSimplePeer from "react-native-simple-peer";
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, } from "react-native-webrtc"

const peer1 = new RNSimplePeer({ initiator: true, webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription  })
const peer2 = new RNSimplePeer({ webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })

peer1.on('signal', data => {
  // when peer1 has signaling data, give it to peer2 somehow
  peer2.signal(data)
})

peer2.on('signal', data => {
  // when peer2 has signaling data, give it to peer1 somehow
  peer1.signal(data)
})

peer1.on('connect', () => {
  // wait for 'connect' event before using the data channel
  peer1.send('hey peer2, how is it going?')
})

peer2.on('data', data => {
  // got a data channel message
  console.log('got a message from peer1: ' + data)
})
```

### video/voice

Video/voice is also super simple! In this example, peer1 sends video to peer2.

```js
import RNSimplePeer from "react-native-simple-peer";
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, } from "react-native-webrtc"

// get video/voice stream
  mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 640,
                height: 480,
                frameRate: 30,
                facingMode: "user",
                deviceId: videoSourceId
            }
        }).then(gotMedia).catch(() => {})

function gotMedia (stream) {
  var peer1 = new RNSimplePeer({ initiator: true, stream: stream, webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } });

  var peer2 = new RNSimplePeer({ webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })

  peer1.on('signal', data => {
    peer2.signal(data)
  })

  peer2.on('signal', data => {
    peer1.signal(data)
  })

  peer2.on('stream', stream => {
    // got remote video stream, now let's show it in a video tag
        let peerStream = stream
        if (stream.currentTarget && stream.currentTarget._remoteStreams) {
            peerStream = stream.currentTarget._remoteStreams[0];
       }
  })
}
```

For two-way video, simply pass a `stream` option into both `Peer` constructors. Simple!


## RNSimplePeer Configs

key props |  type | defualts  | descriptions
--- | --- | --- | --- 
initiator | boolean | false | set to `true` if this is the initiating peer
channelConfig | RTCDataChannelInit/undefined | {} | custom webrtc data channel configuration
channelName | string/undefined | Random String | custom webrtc data channel name
config | RTCConfiguration/undefined | { } | custom webrtc configuration 
offerOptions | RTCOfferOptions/undefined | {} | custom offer options
answerOptions | RTCAnswerOptions/undefined | {} | custom answer options
sdpTransform | Function | (instance, sdp) => {} | function to transform the generated SDP signaling data 
streams | Array<MediaStream>/undefined | undefined | video/voice streams
stream | MediaStream/undefined | undefined | video/voice stream
trickle | boolean | false | set to `false` to disable trickle ICE and get a single 'signal' event
allowHalfTrickle | boolean | false | determines how long to wait before providing an offer or answer 
iceCompleteTimeout | number | 5000 | how long to wait before providing an offer or answer
debugConsole | boolean | true | to show debug console
webRTC | Object | {RTCIceCandidate, RTCPeerConnection, RTCSessionDescription} | Set Webrtc classess


## RNSimplePeer Methods
Method | descriptions
--- | --- 
peer.signal(data) | Call this method whenever the remote peer emits a peer.on('signal') event. The data will encapsulate a webrtc offer, answer, or ice candidate.
peer.send(data) | Send text/binary data to the remote peer. 
peer.addStream(stream) | Add a MediaStream to the connection.
peer.removeStream(stream) | Remove a MediaStream from the connection.
peer.addTrack(track, stream) | Add a MediaStreamTrack to the connection. Must also pass the MediaStream you want to attach it to.
peer.removeTrack(track, stream) | Remove a MediaStreamTrack from the connection. Must also pass the MediaStream that it was attached to.
peer.replaceTrack(oldTrack, newTrack, stream) | Replace a MediaStreamTrack with another track. Must also pass the MediaStream that the old track was attached to.
peer.addTransceiver(kind, init) | Add a RTCRtpTransceiver to the connection. Can be used to add transceivers before adding tracks. Automatically called addTrack.
peer.destroy([err]) | Destroy and cleanup If the optional err parameter is passed, then it will be emitted as an 'error' event on the stream.


## RNSimplePeer Events

Event | descriptions
--- | --- 
peer.removeAllListeners('close') |  removing all registered close-event listeners
peer.on('signal', data => {}) | Fired when the peer wants to send signaling data to the remote peer.
peer.on('connect', () => {}) | Fired when the peer connection and data channel are ready to use.
peer.on('data', data => {}) | Received a message from the remote peer (via the data channel). 
peer.on('stream', stream => {}) | Received a remote video stream
peer.on('track', (track, stream) => {}) | Received a remote audio/video track. Streams may contain multiple tracks.
peer.on('close', () => {}) | Called when the peer connection has closed.
peer.on('error', (err) => {}) | Fired when a fatal error occurs. Usually, this means bad signaling data was received from the remote peer.


### duplex stream

`Peer` objects are instances of `stream.Duplex`. They behave very similarly to a
`net.Socket` from the node core `net` module. The duplex stream reads/writes to the data
channel.

```js
var peer = new RNSimplePeer(props)
// ... signaling ...
peer.write(new Buffer('hey'))
peer.on('data', function (chunk) {
  console.log('got a chunk', chunk)
})
```

## error codes

Errors returned by the `error` event have an `err.code` property that will indicate the origin of the failure.

Possible error codes:
- `ERR_WEBRTC_SUPPORT`
- `ERR_CREATE_OFFER`
- `ERR_CREATE_ANSWER`
- `ERR_SET_LOCAL_DESCRIPTION`
- `ERR_SET_REMOTE_DESCRIPTION`
- `ERR_ADD_ICE_CANDIDATE`
- `ERR_ICE_CONNECTION_FAILURE`
- `ERR_SIGNALING`
- `ERR_DATA_CHANNEL`
- `ERR_CONNECTION_FAILURE`

## connecting more than 2 peers?

The simplest way to do that is to create a full-mesh topology. That means that every peer
opens a connection to every other peer. To illustrate:

![full mesh topology](docs/images/full-mesh.png)

To broadcast a message, just iterate over all the peers and call `peer.send`.

So, say you have 3 peers. Then, when a peer wants to send some data it must send it 2
times, once to each of the other peers. So you're going to want to be a bit careful about
the size of the data you send.

Full mesh topologies don't scale well when the number of peers is very large. The total
number of edges in the network will be ![full mesh formula](docs/images/full-mesh-formula.png)
where `n` is the number of peers.

For clarity, here is the code to connect 3 peers together:

#### Peer 1

```js
// These are peer1's connections to peer2 and peer3
var peer2 = new RNSimplePeer({ initiator: true, webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })
var peer3 = new RNSimplePeer({ initiator: true, webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })

peer2.on('signal', data => {
  // send this signaling data to peer2 somehow
})

peer2.on('connect', () => {
  peer2.send('hi peer2, this is peer1')
})

peer2.on('data', data => {
  console.log('got a message from peer2: ' + data)
})

peer3.on('signal', data => {
  // send this signaling data to peer3 somehow
})

peer3.on('connect', () => {
  peer3.send('hi peer3, this is peer1')
})

peer3.on('data', data => {
  console.log('got a message from peer3: ' + data)
})
```

#### Peer 2

```js
// These are peer2's connections to peer1 and peer3
var peer1 = new RNSimplePeer({ webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })
var peer3 = new RNSimplePeer({ initiator: true, webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })

peer1.on('signal', data => {
  // send this signaling data to peer1 somehow
})

peer1.on('connect', () => {
  peer1.send('hi peer1, this is peer2')
})

peer1.on('data', data => {
  console.log('got a message from peer1: ' + data)
})

peer3.on('signal', data => {
  // send this signaling data to peer3 somehow
})

peer3.on('connect', () => {
  peer3.send('hi peer3, this is peer2')
})

peer3.on('data', data => {
  console.log('got a message from peer3: ' + data)
})
```

#### Peer 3

```js
// These are peer3's connections to peer1 and peer2
var peer1 = new RNSimplePeer({webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })
var peer2 = new RNSimplePeer({webRTC: { RTCPeerConnection,  RTCIceCandidate, RTCSessionDescription } })

peer1.on('signal', data => {
  // send this signaling data to peer1 somehow
})

peer1.on('connect', () => {
  peer1.send('hi peer1, this is peer3')
})

peer1.on('data', data => {
  console.log('got a message from peer1: ' + data)
})

peer2.on('signal', data => {
  // send this signaling data to peer2 somehow
})

peer2.on('connect', () => {
  peer2.send('hi peer2, this is peer3')
})

peer2.on('data', data => {
  console.log('got a message from peer2: ' + data)
})
```

## memory usage

If you call `peer.send(buf)`, `simple-peer` is not keeping a reference to `buf`
and sending the buffer at some later point in time. We immediately call
`channel.send()` on the data channel. So it should be fine to mutate the buffer
right afterward.

However, beware that `peer.write(buf)` (a writable stream method) does not have
the same contract. It will potentially buffer the data and call
`channel.send()` at a future point in time, so definitely don't assume it's
safe to mutate the buffer.


## connection does not work on some networks?

If a direct connection fails, in particular, because of NAT traversal and/or firewalls,
WebRTC ICE uses an intermediary (relay) TURN server. In other words, ICE will first use
STUN with UDP to directly connect peers and, if that fails, will fall back to a TURN relay
server.

In order to use a TURN server, you must specify the `config` option to the `Peer`
constructor. See the API docs above.

### Donate

<p><a href="https://www.paypal.me/ajithab" rel="nofollow"><img height="75" src="https://raw.githubusercontent.com/stefan-niedermann/paypal-donate-button/master/paypal-donate-button.png" style="max-width:100%;"></a></p>

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
