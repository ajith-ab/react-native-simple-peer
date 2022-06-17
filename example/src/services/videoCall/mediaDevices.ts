import { mediaDevices, MediaStream } from "react-native-webrtc"


const getLocalStream = (): Promise<MediaStream> => new Promise((resolve, reject) => {
    mediaDevices.enumerateDevices().then((sourceInfos: any) => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if (sourceInfo.kind == "videoinput" && sourceInfo.facing == "front") {
                videoSourceId = sourceInfo.deviceId;
            }
        }
        mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 640,
                height: 480,
                frameRate: 30,
                facingMode: "user",
                deviceId: videoSourceId
            }
        })
            .then(stream => {
                resolve(stream as MediaStream)
            })
            .catch(error => {
                reject({ message: "Local Stream fetch error" })
            });

    }).catch((e) => {
        reject({ message: "Device List fetch error" })
    })
})

export {
    getLocalStream
}