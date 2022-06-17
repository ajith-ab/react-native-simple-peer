import { StyleSheet } from "react-native";

const VideoCallStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
    callButton: {
        width: "auto",
    },
    videoContainer: {
        height: "43%", 
        width: "100%", 
        margin: 10 
    },
    video:{
        flex: 1, 
        width: '100%', 
        height: '100%'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "80%"
      },
      text: {
        textAlign: "center", 
        marginTop: "20%"
      },
      buttonContainer: {
        alignContent: "center", 
        justifyContent: "center", 
        width: "100%",  
        flexDirection: "row"
      },
      buttonEndCall: {
        width: 100,
        backgroundColor: "red"
      }
});

export {
    VideoCallStyles
}