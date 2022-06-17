

const peerConfig = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:global.stun.twilio.com:3478'
        ]
      }
    ],
    sdpSemantics: 'unified-plan'
}

const MAX_BUFFERED_AMOUNT = 64 * 1024
const ICECOMPLETE_TIMEOUT = 5 * 1000
const CHANNEL_CLOSING_TIMEOUT = 5 * 1000

export {
    peerConfig,
    MAX_BUFFERED_AMOUNT,
    ICECOMPLETE_TIMEOUT,
    CHANNEL_CLOSING_TIMEOUT
}