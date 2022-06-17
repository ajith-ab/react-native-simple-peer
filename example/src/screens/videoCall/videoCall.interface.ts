import type { MediaStream } from "react-native-webrtc";

export interface IVideoCall{    

}

export interface IVideoCallComponent{
    localStream: MediaStream | null,
    remoteStream: MediaStream | null,
    rUser: any,
    roomId?: string | null
    onRoomSubmit: (roomId: string) => void
    onEndCall: () => void
}