import type { DuplexOptions, Duplex } from "readable-stream";
import type RTCConfiguration from "react-native-webrtc/lib/typescript/RTCPeerConnection";
import type RTCIceCandidate from "react-native-webrtc/lib/typescript/RTCIceCandidate";
import type MediaStream from "react-native-webrtc/lib/typescript/MediaStream";
import type MediaStreamTrack from "react-native-webrtc/lib/typescript/MediaStreamTrack";

export type IRNSimplePeer = {
    prototype: Instance;
    (props?: IRNSimplePeerProps): Instance;
    config: RTCConfiguration;
    channelConfig: any;
}


export interface IRNSimplePeerProps extends DuplexOptions {
    initiator?: boolean | undefined;
    channelConfig?: any | undefined;
    channelName?: string | undefined;
    config: RTCConfiguration | undefined;
    offerOptions?: any | undefined;
    answerOptions?: any | undefined;
    sdpTransform?: ((this: Instance, sdp: string) => string) | undefined;
    streams?: Array<MediaStream> | undefined;
    stream?: MediaStream | undefined;
    trickle?: boolean | undefined;
    allowHalfTrickle?:  boolean | undefined;
    iceCompleteTimeout?: number | undefined;
    debugConsole?: boolean | undefined;
    webRTC?: {
        RTCIceCandidate: any,
        RTCPeerConnection: any,
        RTCSessionDescription: any
    }
}

type SignalData =
    | {
        type: "transceiverRequest";
        transceiverRequest: {
            kind: string;
            init?: any | undefined;
        };
    }
    | {
        type: "renegotiate";
        renegotiate: true;
    }
    | {
        type: "candidate";
        candidate: RTCIceCandidate;
    }
    | any;


type SimplePeerData = string | Buffer | ArrayBuffer | Blob;

interface Instance extends Duplex {
    signal(data: string | SignalData): void;
    send(data: SimplePeerData): void;
    addStream(stream: MediaStream): void;
    removeStream(stream: MediaStream): void;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
    replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack, stream: MediaStream): void;
    addTransceiver(kind: string, init?: any): void;
    destroy(error?: Error): any;

    readonly bufferSize: number;
    readonly connected: boolean;

    address():
        | { port: undefined; family: undefined; address: undefined }
        | { port: number; family: "IPv6" | "IPv4"; address: string };

    _debug(message?: any, ...optionalParams: any[]): void;

    // ******
    // events
    // ******
    addListener(event: "connect" | "close" | "end" | "pause" | "readable" | "resume", listener: () => void): this;
    addListener(event: "signal", listener: (data: SignalData) => void): this;
    addListener(event: "stream", listener: (stream: MediaStream) => void): this;
    addListener(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    addListener(event: "data", listener: (chunk: any) => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;

    emit(event: "connect" | "close" | "end" | "pause" | "readable" | "resume"): boolean;
    emit(event: "signal", data: SignalData): this;
    emit(event: "stream", stream: MediaStream): this;
    emit(event: "track", track: MediaStreamTrack, stream: MediaStream): this;
    emit(event: "data", chunk: any): boolean;
    emit(event: "error", err: Error): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;

    on(event: "connect" | "close" | "end" | "pause" | "readable" | "resume", listener: () => void): this;
    on(event: "signal", listener: (data: SignalData) => void): this;
    on(event: "stream", listener: (stream: MediaStream) => void): this;
    on(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    on(event: "data", listener: (chunk: any) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;

    once(event: "connect" | "close" | "end" | "pause" | "readable" | "resume", listener: () => void): this;
    once(event: "signal", listener: (data: SignalData) => void): this;
    once(event: "stream", listener: (stream: MediaStream) => void): this;
    once(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    once(event: "data", listener: (chunk: any) => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    prependListener(
        event: "connect" | "close" | "end" | "pause" | "readable" | "resume",
        listener: () => void,
    ): this;
    prependListener(event: "signal", listener: (data: SignalData) => void): this;
    prependListener(event: "stream", listener: (stream: MediaStream) => void): this;
    prependListener(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    prependListener(event: "data", listener: (chunk: any) => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

    prependOnceListener(
        event: "connect" | "close" | "end" | "pause" | "readable" | "resume",
        listener: () => void,
    ): this;
    prependOnceListener(event: "signal", listener: (data: SignalData) => void): this;
    prependOnceListener(event: "stream", listener: (stream: MediaStream) => void): this;
    prependOnceListener(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    prependOnceListener(event: "data", listener: (chunk: any) => void): this;
    prependOnceListener(event: "error", listener: (err: Error) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

    removeListener(
        event: "connect" | "close" | "end" | "pause" | "readable" | "resume",
        listener: () => void,
    ): this;
    removeListener(event: "signal", listener: (data: SignalData) => void): this;
    removeListener(event: "stream", listener: (stream: MediaStream) => void): this;
    removeListener(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    removeListener(event: "data", listener: (chunk: any) => void): this;
    removeListener(event: "error", listener: (err: Error) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;

}