import React, { FC } from "react";
import { View, TextInput, Text, SafeAreaView, Button } from "react-native";
import { RTCView } from "react-native-webrtc";
import type { IVideoCallComponent } from "./videoCall.interface";
import { VideoCallStyles as styles } from "./videoCall.styles";


const VideoCallComponent: FC<IVideoCallComponent> = (props) => {
    const { localStream, roomId, remoteStream, onRoomSubmit, rUser, onEndCall } = props;
    const [text, onChangeText] = React.useState("");

    if (!roomId) {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Enter your room"
                />
                <Button onPress={() => onRoomSubmit(text)} title="Create/ join" ></Button>
            </View>
        )
    }

    return (
        <SafeAreaView>
                <View style={styles.videoContainer}>
                    {localStream &&
                        <RTCView
                            style={styles.video}
                            streamURL={localStream?.toURL()}
                        />}
                </View>
                <View style={styles.videoContainer} >
                    {remoteStream ?
                        <RTCView
                            style={styles.video}
                            streamURL={remoteStream?.toURL()}
                        /> : <Text style={styles.text} >{`Waiting for ${rUser.name}`}</Text>}
                </View>

                <View style={styles.buttonContainer} >
                    <Button style={styles.buttonEndCall} onPress={onEndCall} title="End Call" ></Button>
                </View>
        </SafeAreaView>
    )

}

export default VideoCallComponent;