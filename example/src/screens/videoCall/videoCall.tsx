import VideoCallService from "../../services/videoCall/videoCall";
import React, { FC, useEffect, useRef, useState } from "react";
import type { MediaStream } from "react-native-webrtc";
import VideoCallComponent from "./videoCall.component";
import type { IVideoCall } from "./videoCall.interface";
import { Alert } from "react-native";

const VideoCall: FC<IVideoCall> = (props) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    let videoCallRef = useRef<VideoCallService>(new VideoCallService());
    const rUser =  { name: "End User" };

    useEffect(() => {
        videoCallRef.current
            ?.on("localStream", (payload: any) => {
                setLocalStream(payload.stream)
            })
            ?.on("remoteStream", (payload: any) => {
                setRemoteStream(payload.stream);
            })
            ?.on("error", (error: any) => {
                Alert.alert(
                    "Error",
                    error.message || "Something went wrong, Please try again later.",
                    [
                        { text: "OK", onPress: handleOkPress }
                    ]
                )
            })

        return () => {
            videoCallRef.current?.stop();
        }
    }, []);

    const handleOkPress = () => {
        videoCallRef.current?.stop();
        setRoomId(null);
    }



    const onRoomSubmit = (roomId: string) => {
        setRoomId(roomId);
        videoCallRef.current.joinRoom(roomId);
    }



    return (
        <VideoCallComponent
            localStream={localStream}
            remoteStream={remoteStream}
            rUser={rUser}
            roomId={roomId}
            onRoomSubmit={onRoomSubmit}
            onEndCall={handleOkPress}
        />
    )
}

export default VideoCall;