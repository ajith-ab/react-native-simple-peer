import socket from "../socket/socket";
import type { IVideoCallService } from "./videoCall.interface";
import type { MediaStream } from 'react-native-webrtc';
import { getLocalStream } from "./mediaDevices";
import EventEmitter from './emiter';
import SimplePeer from "./simplePeer";

class VideoCallService extends EventEmitter implements IVideoCallService {
    protected simplePeer: SimplePeer = new SimplePeer();
    protected peer: any;
    protected initiator: boolean = false;
    protected roomId: string = "";
    protected remoteStream: any;
    protected localStream: MediaStream | undefined;

    // JOIN Room
    joinRoom(roomId: string) {
        this.roomId = roomId;
        getLocalStream().then((stream: MediaStream) => {
            this.emit("localStream", { stream })
            socket.emit("join", { roomId })
            this.handleEvents();
            this.localStream = stream;
        }).catch(() => {
            this.sendError("Camera Permission Failed")
        })
    }

    handleEvents(): void {
        socket
            .on("init", () => {
                this.initiator = true;
                console.log("init");
            })
            .on("ready", () => {
                console.log("ready");
                this.enterRoom(this.roomId);
            })
            .on("full", () => {
                
                this.sendError("This User already joined.")
            })
            .on('desc', (data: any) => {
                console.log(data);
                
                if (data.type === 'offer' && this.initiator) return;
                if (data.type === 'answer' && !this.initiator) return;
                this.call(data);
            })
            .on('disconnected', () => {
                this.initiator = true
            });
    }

    enterRoom(roomId: string) {
        this.emit("connecting", true);
        const peer = this.simplePeer.init(
            this.localStream,
            this.initiator
        );
        this.peer = peer;
        peer.on('signal', (data: any) => {
            console.log(data);
            
            const signal = {
                room: roomId,
                desc: data
            };
            socket.emit('signal', signal);
        });
        peer.on('stream', (stream: any) => {

            if (stream.currentTarget && stream.currentTarget._remoteStreams) {
                stream = stream.currentTarget._remoteStreams[0];
            }
            this.remoteStream = stream;
            this.emit("remoteStream", { stream: stream })
            this.emit("connecting", false);

        });
        peer.on('error', (err: any) => {
            this.sendError("Webrtc Intialization failed")
        });
    }


    call = (otherId: any) => {
        this.simplePeer.connect(otherId);
    };

    sendError(message: string) {
        this.emit("error", { message })
    }

    stop() {
        this.localStream?.getTracks().forEach((t: any) => t.stop());
        this.localStream?.release();
        socket.emit("leaveRoom", { roomId: this.roomId });
    }
}

export default VideoCallService;