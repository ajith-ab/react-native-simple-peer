import RNSimplePeer from 'react-native-simple-peer';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
} from 'react-native-webrtc';

export default class SimplePeer {
    public peer: any = null;

    init = (stream: any, initiator: boolean) => {


        this.peer = new RNSimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: true,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    {
                        urls: 'turn:numb.viagenie.ca',
                        credential: 'ajith4abizz@gmail.com',
                        username: 'ajith4abizz@gmail.com'
                    },
                    {
                        urls: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                ]
            } as any,
           webRTC: {
                RTCPeerConnection,
                RTCIceCandidate,
                RTCSessionDescription,
           }
        })        
        return this.peer
    }
    connect = (otherId: any) => {
        this.peer.signal(otherId)
    }
}