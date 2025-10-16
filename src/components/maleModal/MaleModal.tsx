import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Volume2, VolumeX } from "lucide-react";
import { connectLivekitSocket, getGenerateToken } from "../../services/aiAgent";
import { Room, RoomEvent, createLocalAudioTrack, createLocalVideoTrack, Track } from "livekit-client";
import { LiveKitRoom, RoomAudioRenderer, ParticipantTile, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";



interface MaleModalProps {
    onClose: () => void;
}

const MaleModal: React.FC<MaleModalProps> = ({ onClose }) => {
    // Manage the websocket and media lifecycle without altering existing UI
    const wsRef = useRef<WebSocket | null>(null);
    const mediaRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const roomRef = useRef<Room | null>(null);
    const [started, setStarted] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);
    type ChatMsg = { id: string; role: "user" | "agent"; text: string };
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [remoteVideoActive, setRemoteVideoActive] = useState(false);

    const extractTranscript = (raw: any): { role: "user" | "agent"; text: string } | null => {
        try {
            let input: any = raw;
            if (raw instanceof ArrayBuffer) {
                input = new TextDecoder().decode(raw);
            } else if (ArrayBuffer.isView(raw)) {
                // TypedArray (e.g., Uint8Array) fallback
                try { input = new TextDecoder().decode(raw as Uint8Array); } catch { /* ignore */ }
            }

            const msg = typeof input === 'string'
                ? (() => { try { return JSON.parse(input); } catch { return { text: input }; } })()
                : input;

            const candidates = [
                msg?.text,
                msg?.content,
                msg?.message,
                msg?.transcript,
                msg?.partial,
                msg?.final,
                msg?.delta,
                msg?.payload?.text,
                msg?.data?.text,
                msg?.data?.content,
                msg?.data?.message,
                msg?.data?.transcript,
                msg?.data?.delta,
                msg?.data?.payload?.text,
                msg?.alternatives?.[0]?.transcript,
                msg?.choices?.[0]?.delta?.content,
                msg?.choices?.[0]?.message?.content,
            ];
            const text = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
            if (!text) {
                console.debug('[Transcript] No textual content found in message:', msg);
                return null;
            }

            const roleCandidates = [
                (msg?.role === 'user' || msg?.role === 'agent') ? msg?.role : undefined,
                // (msg?.origin === 'user' || msg?.origin === 'agent') ? msg?.origin : undefined,
                // (msg?.sender === 'user' || msg?.sender === 'agent') ? msg?.sender : undefined,
                // (msg?.data?.role === 'user' || msg?.data?.role === 'agent') ? msg?.data?.role : undefined,
            ].filter(Boolean) as ("user" | "agent")[];

            const role = roleCandidates[0] || 'agent';
            return { role, text };
        } catch {
            return null;
        }
    };

    const LiveKitAVLayer: React.FC = () => {
        const allCamTracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }]);
        const remoteCam = allCamTracks.filter((t) => !t.participant.isLocal);
        const mainRemote = remoteCam[0] || null;

        return (
            <>
                <RoomAudioRenderer room={roomRef.current as Room} />
                {/* Main Participant Video (fills container) */}
                {mainRemote ? (
                    <div className="w-full h-full">
                        <ParticipantTile trackRef={mainRemote} className="w-full h-full" />
                    </div>
                ) : (
                    <img
                        src="./ai-20.png"
                        alt="Main Participant"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Small local preview bottom-right */}
                <div className="absolute bottom-6 right-6 w-40 h-28 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-black">
                    <LocalCameraTile />
                </div>
            </>
        );
    };

    const LocalCameraTile: React.FC = () => {
        const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);
        const localCam = tracks.find((t) => t.participant.isLocal) || null;

        if (!localCam) {
            return (
                <img
                    src="./Rectangle 34.png"
                    alt="Small Participant"
                    className="w-full h-full object-cover"
                />
            );
        }
        return <ParticipantTile trackRef={localCam} className="w-full h-full" />;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const fetchToken = async () => {
                try {
                    
                    const raw = localStorage.getItem("auth");
                    let username = "guest";

                    if (raw !== null) {
                        const user = JSON.parse(raw);
                        username = user?.username || "guest";
                    }
                    const tokenData = await getGenerateToken({
                        name: username,
                        api_key: import.meta.env.VITE_LIVEKIT_API_KEY,
                        api_secret: import.meta.env.VITE_LIVEKIT_API_SECRET,
                    } as any);
                    console.log("Succesfully Generated LiveKit token ");
                    if (tokenData?.token) {
                        console.log("Token:", tokenData.token);
                    } else {
                        console.warn("Token not found in response:", tokenData);
                    }
                } catch (err) {
                    console.error("Error fetching token:", err);
                }
            };

            fetchToken();
            try {
                wsRef.current?.close();
            } catch {
                // ignore
            }
            wsRef.current = null;

            try {
                mediaRef.current?.getTracks().forEach((t) => t.stop());
            } catch {
                // ignore
            }
            mediaRef.current = null;
            try {
                if (localVideoRef.current) {
                    localVideoRef.current.pause();
                    // @ts-ignore
                    localVideoRef.current.srcObject = null;
                }
            } catch { }
            try {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.pause();
                    // @ts-ignore
                    remoteVideoRef.current.srcObject = null;
                }
                if (remoteAudioRef.current) {
                    remoteAudioRef.current.pause();
                    remoteAudioRef.current.srcObject = null as any;
                }
            } catch { }
            try {
                roomRef.current?.disconnect();
            } catch { }
            roomRef.current = null;
            setRemoteVideoActive(false);
        };
    }, []);

    // Re-bind stream to video when started or tracks change
    useEffect(() => {
        if (!started) return;
        const stream = mediaRef.current;
        if (localVideoRef.current && stream) {
            try {
                // @ts-ignore
                if (localVideoRef.current.srcObject !== stream) {
                    // @ts-ignore
                    localVideoRef.current.srcObject = stream;
                }
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(() => { });
            } catch { }
        }
    }, [started, camOn, micOn]);



    const handleStartCall = async () => {

        try {
            // Request camera and mic permissions
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
                audio: true,
            });

            mediaRef.current = stream;
            // Ensure tracks enabled
            mediaRef.current.getVideoTracks().forEach((t) => (t.enabled = true));
            mediaRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
            // Bind to preview video
            if (localVideoRef.current) {
                // @ts-ignore
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true; // avoid feedback
                localVideoRef.current.onloadedmetadata = () => {
                    localVideoRef.current?.play().catch(() => { });
                };
            }

            // Connect to AI Agent after permissions granted
            wsRef.current = connectLivekitSocket("avatar-rafik", async (msg: any) => {
                const parsed = extractTranscript(msg);
                if (parsed) {
                    // console.debug('[Transcript][WS] Appending:', parsed);
                    setMessages((prev) => ([
                        ...prev,
                        { id: `${Date.now()}-${prev.length}`, role: parsed.role, text: parsed.text }
                    ]));
                }
                else if (typeof msg === 'string' && msg.trim()) {
                    setMessages((prev) => ([
                        ...prev,
                        { id: `${Date.now()}-${prev.length}`, role: 'agent', text: msg.trim() }
                    ]));
                } else if (msg && (msg instanceof ArrayBuffer || ArrayBuffer.isView(msg))) {
                    const size = msg instanceof ArrayBuffer ? msg.byteLength : (msg as ArrayBufferView).byteLength;
                    setMessages((prev) => ([
                        ...prev,
                        { id: `${Date.now()}-${prev.length}`, role: 'agent', text: `[binary ${size} bytes]` }
                    ]));
                }

                if (msg?.type === 'token_response') {
                    const token = msg?.data?.participantToken || msg?.data?.token || msg?.token;
                    const livekitUrl = (import.meta as any)?.env?.VITE_LIVEKIT_WS_URL;
                    if (!livekitUrl) {
                        console.warn("Missing VITE_LIVEKIT_WS_URL in .env for LiveKit connection");
                        return;
                    }
                    try {
                        if (!roomRef.current) {
                            const room = new Room();
                            roomRef.current = room;

                            room.on(RoomEvent.TrackSubscribed, (track) => {
                                if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
                                    const ms = new MediaStream([track.mediaStreamTrack]);
                                    // @ts-ignore
                                    remoteVideoRef.current.srcObject = ms;
                                    remoteVideoRef.current
                                        .play()
                                        .then(() => setRemoteVideoActive(true))
                                        .catch(() => setRemoteVideoActive(true));
                                }
                                if (track.kind === Track.Kind.Audio) {
                                    if (!remoteAudioRef.current) return;
                                    const ms = new MediaStream([track.mediaStreamTrack]);
                                    remoteAudioRef.current.srcObject = ms as any;
                                    if (speakerOn) remoteAudioRef.current.play().catch(() => { });
                                }
                            });

                            room.on(RoomEvent.DataReceived, (payload) => {
                                try {
                                    const textData = typeof payload === 'string'
                                        ? payload
                                        : ArrayBuffer.isView(payload)
                                            ? new TextDecoder().decode(payload as Uint8Array)
                                            : new TextDecoder().decode(payload as ArrayBuffer);
                                    const parsedMsg = extractTranscript(textData) || { role: 'agent' as const, text: textData };
                                    if (parsedMsg?.text) {
                                        // console.debug('[Transcript][LK-WS] Appending:', parsedMsg);
                                        setMessages((prev) => ([
                                            ...prev,
                                            { id: `${Date.now()}-${prev.length}`, role: parsedMsg.role, text: parsedMsg.text }
                                        ]));
                                    }
                                    else if (textData && `${textData}`.trim()) {
                                        setMessages((prev) => ([
                                            ...prev,
                                            { id: `${Date.now()}-${prev.length}`, role: 'agent', text: `${textData}`.trim() }
                                        ]));
                                    } else if (payload && (payload instanceof ArrayBuffer || ArrayBuffer.isView(payload))) {
                                        const size = payload instanceof ArrayBuffer ? payload.byteLength : (payload as ArrayBufferView).byteLength;
                                        setMessages((prev) => ([
                                            ...prev,
                                            { id: `${Date.now()}-${prev.length}`, role: 'agent', text: `[binary ${size} bytes]` }
                                        ]));
                                    }
                                } catch { }
                            });

                            // LiveKit Text Stream (if supported by this SDK build)
                            try {
                                const anyRoom: any = room as any;
                                if (typeof anyRoom.registerTextStreamHandler === 'function') {
                                    anyRoom.registerTextStreamHandler('lk.transcription', async (reader: any) => {
                                        try {
                                            const message = await reader.readAll();
                                            const parsed = extractTranscript(message) || { role: 'agent' as const, text: `${message}` };
                                            if (parsed?.text) {
                                                setMessages((prev) => ([
                                                    ...prev,
                                                    { id: `${Date.now()}-${prev.length}`, role: parsed.role, text: parsed.text }
                                                ]));
                                            }
                                        } catch { }
                                    });
                                }
                            } catch {}

                            await room.connect(livekitUrl, token);

                            // Publish/enable local mic and camera (use LiveKit-created tracks for correct source types)
                            try {
                                const mic = await createLocalAudioTrack();
                                await room.localParticipant.publishTrack(mic.mediaStreamTrack);
                                const videoTracks = mediaRef.current?.getVideoTracks();
                                if (videoTracks && videoTracks[0]) {
                                    await room.localParticipant.publishTrack(videoTracks[0]);
                                } else {
                                    const cam = await createLocalVideoTrack();
                                    await room.localParticipant.publishTrack(cam.mediaStreamTrack);
                                }
                                await room.localParticipant.setMicrophoneEnabled(true);
                                await room.localParticipant.setCameraEnabled(true);
                            } catch (e) {
                                console.warn("Failed to publish local audio:", e);
                            }
                        }
                    } catch (e) {
                        console.error("Failed to join LiveKit room:", e);
                    }
                }
            });

            // Also support direct connection using generated token without waiting for WS
            try {
                const raw = localStorage.getItem("auth");
                let username = "guest";
                if (raw !== null) {
                    const user = JSON.parse(raw);
                    username = user?.username || "guest";
                }
                const tokenData = await getGenerateToken({
                    name: username,
                    api_key: (import.meta as any)?.env?.VITE_LIVEKIT_API_KEY,
                    api_secret: (import.meta as any)?.env?.VITE_LIVEKIT_API_SECRET,
                } as any);

                const token = tokenData?.token;
                const livekitUrl = (import.meta as any)?.env?.VITE_LIVEKIT_WS_URL;
                if (token && livekitUrl) {
                    try {
                        if (!roomRef.current) {
                            const room = new Room();
                            roomRef.current = room;

                            room.on(RoomEvent.TrackSubscribed, (track) => {
                                if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
                                    const ms = new MediaStream([track.mediaStreamTrack]);
                                    // @ts-ignore
                                    remoteVideoRef.current.srcObject = ms;
                                    remoteVideoRef.current
                                        .play()
                                        .then(() => setRemoteVideoActive(true))
                                        .catch(() => setRemoteVideoActive(true));
                                }
                                if (track.kind === Track.Kind.Audio) {
                                    if (!remoteAudioRef.current) return;
                                    const ms = new MediaStream([track.mediaStreamTrack]);
                                    remoteAudioRef.current.srcObject = ms as any;
                                    if (speakerOn) remoteAudioRef.current.play().catch(() => { });
                                }
                            });

                            room.on(RoomEvent.DataReceived, (payload) => {
                                try {
                                    const textData = typeof payload === 'string'
                                        ? payload
                                        : ArrayBuffer.isView(payload)
                                            ? new TextDecoder().decode(payload as Uint8Array)
                                            : new TextDecoder().decode(payload as ArrayBuffer);
                                    const parsedMsg = extractTranscript(textData) || { role: 'agent' as const, text: textData };
                                    if (parsedMsg?.text) {
                                        // console.debug('[Transcript][LK] Appending:', parsedMsg);
                                        setMessages((prev) => ([
                                            ...prev,
                                            { id: `${Date.now()}-${prev.length}`, role: parsedMsg.role, text: parsedMsg.text }
                                        ]));
                                    }
                                    else if (textData && `${textData}`.trim()) {
                                        setMessages((prev) => ([
                                            ...prev,
                                            { id: `${Date.now()}-${prev.length}`, role: 'agent', text: `${textData}`.trim() }
                                        ]));
                                    }
                                } catch { }
                            });

                            // LiveKit Text Stream (if supported by this SDK build)
                            try {
                                const anyRoom: any = room as any;
                                if (typeof anyRoom.registerTextStreamHandler === 'function') {
                                    anyRoom.registerTextStreamHandler('lk.transcription', async (reader: any) => {
                                        try {
                                            const message = await reader.readAll();
                                            const parsed = extractTranscript(message) || { role: 'agent' as const, text: `${message}` };
                                            if (parsed?.text) {
                                                setMessages((prev) => ([
                                                    ...prev,
                                                    { id: `${Date.now()}-${prev.length}`, role: parsed.role, text: parsed.text }
                                                ]));
                                            }
                                        } catch { }
                                    });
                                }
                            } catch {}

                            await room.connect(livekitUrl, token);

                            // Publish local mic and camera (if available)
                            try {
                                const audioTracks = mediaRef.current?.getAudioTracks();
                                if (audioTracks && audioTracks[0]) {
                                    await room.localParticipant.publishTrack(audioTracks[0]);
                                } else {
                                    const mic = await createLocalAudioTrack();
                                    await room.localParticipant.publishTrack(mic.mediaStreamTrack);
                                }
                                const videoTracks = mediaRef.current?.getVideoTracks();
                                if (videoTracks && videoTracks[0]) {
                                    await room.localParticipant.publishTrack(videoTracks[0]);
                                }
                                await room.localParticipant.setMicrophoneEnabled(true);
                                await room.localParticipant.setCameraEnabled(true);
                            } catch (e) {
                                console.warn("Failed to publish local audio:", e);
                            }
                        }
                    } catch (e) {
                        console.error("Failed to join LiveKit room with direct token:", e);
                    }
                } else {
                    if (!token) console.warn("No token returned from getGenerateToken()");
                    if (!livekitUrl) console.warn("Missing VITE_LIVEKIT_WS_URL in .env for LiveKit connection");
                }
            } catch (e) {
                console.warn("Direct LiveKit connect attempt failed:", e);
            }

            setStarted(true);
        } catch (err) {
            console.error("Failed to start call:", err);
        }
    };

    const handleToggleMic = () => {
        const tracks = mediaRef.current?.getAudioTracks() || [];
        const next = !micOn;
        tracks.forEach((t) => (t.enabled = next));
        setMicOn(next);
        try {
            roomRef.current?.localParticipant.setMicrophoneEnabled(next);
        } catch {}
    };

    const handleToggleCam = () => {
        const tracks = mediaRef.current?.getVideoTracks() || [];
        const next = !camOn;
        tracks.forEach((t) => (t.enabled = next));
        setCamOn(next);
        try {
            roomRef.current?.localParticipant.setCameraEnabled(next);
        } catch {}
    };

    const handleToggleSpeaker = () => {
        const next = !speakerOn;
        setSpeakerOn(next);
        try {
            if (remoteAudioRef.current) {
                if (next) remoteAudioRef.current.play().catch(() => { });
                else remoteAudioRef.current.pause();
            }
        } catch { }
    };

    const handleEndCall = () => {
        try { wsRef.current?.close(); } catch { }
        wsRef.current = null;
        try { mediaRef.current?.getTracks().forEach((t) => t.stop()); } catch { }
        mediaRef.current = null;
        try {
            if (localVideoRef.current) {
                localVideoRef.current.pause();
                // @ts-ignore
                localVideoRef.current.srcObject = null;
            }
        } catch { }
        setStarted(false);
        setMicOn(true);
        setCamOn(true);
        setSpeakerOn(true);
        setMessages([]);
        setRemoteVideoActive(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            {/* Modal Container */}
            <div className="relative w-[95%] max-w-6xl gap-3 h-[80vh] flex  rounded-2xl overflow-hidden">
                {/* Start Call Overlay (appears first) */}
                {!started && (
                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <button
                            onClick={handleStartCall}
                            className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-dark)] font-semibold shadow-lg hover:bg-[var(--text-dark-hover)] border border-white/20"
                        >
                            Start Call
                        </button>
                    </div>
                )}
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white font-bold text-xl hover:text-red-500 z-50"
                >
                    ✕
                </button>

                {/* Left Section (Video Call) */}
                <div className="flex-1 relative bg-black rounded-2xl flex items-center justify-center">
                    {roomRef.current ? (
                        <LiveKitRoom room={roomRef.current}>
                            <LiveKitAVLayer />
                        </LiveKitRoom>
                    ) : (
                        <>
                            {/* Main Participant Video (fallback) */}
                            {remoteVideoActive ? (
                                <video
                                    ref={remoteVideoRef}
                                    className="w-full h-full object-cover"
                                    playsInline
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src="./ai-20.png"
                                    alt="Main Participant"
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Small user camera (Bottom-right overlay) fallback  */}
                            <div className="absolute bottom-6 right-6 w-40 h-28 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-black">
                                {started && mediaRef.current && mediaRef.current.getVideoTracks().some((t) => t.readyState === 'live' && t.enabled) ? (
                                    <video
                                        ref={localVideoRef}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        autoPlay
                                        muted
                                    />
                                ) : (
                                    <img
                                        src="./Rectangle 34.png"
                                        alt="Small Participant"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* Call Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
                        <button onClick={handleToggleMic} aria-label="Toggle microphone" className="p-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--text-dark-hover)]">
                            {micOn ? <Mic size={20} className="text-[var(--color-primary-dark)]" /> : <MicOff size={20} className="text-[var(--color-primary-dark)]" />}
                        </button>
                        <button onClick={handleToggleCam} aria-label="Toggle camera" className="p-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--text-dark-hover)] ">
                            {camOn ? <VideoIcon size={20} className="text-[var(--color-primary-dark)]" /> : <VideoOff size={20} className="text-[var(--color-primary-dark)]" />}
                        </button>
                        <button onClick={handleEndCall} aria-label="End call" className="p-3 rounded-full bg-[var(--color-primary-dark)]  text-[var(--color-primary)] hover:bg-[var(--text-dark-hover)] hover:text-[var(--color-primary-dark)]">
                            <Phone size={20} />
                        </button>
                        <button onClick={handleToggleSpeaker} aria-label="Toggle speaker" className="p-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--text-dark-hover)]">
                            {speakerOn ? <Volume2 size={20} className="text-[var(--color-primary-dark)]" /> : <VolumeX size={20} className="text-[var(--color-primary-dark)]" />}
                        </button>
                        {/* <button className="p-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--text-dark-hover)]">
                            <Settings size={20} />
                        </button> */}
                    </div>
                    {/* Hidden audio element for remote audio */}
                    <audio ref={remoteAudioRef} hidden />
                </div>

                {/* Right Section (Transcript) */}
                <div className="w-80 bg-[var(--color-primary-dark)]/90 text-[var(--color-primary)] rounded-2xl flex flex-col border-l border-white/20">
                    <h3 className="text-lg font-semibold p-4 border-b border-white/20">
                        Live Transcript
                    </h3>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
                        {messages.length === 0 ? (
                            <p className="text-xs text-white/70">Transcript will appear here once the call starts.</p>
                        ) : (
                            messages.map((m) => (
                                m.role === 'user' ? (
                                    <div key={m.id} className="flex flex-col items-end gap-1">
                                        <p className="text-xs text-white pr-8">You</p>
                                        <div className="flex items-start gap-2">
                                            <p className="bg-white text-[var(--color-primary-dark)] px-3 py-2 rounded-lg">{m.text}</p>
                                            <img src="./Rectangle 34.png" alt="You" className="w-6 h-6 rounded-full" />
                                        </div>
                                    </div>
                                ) : (
                                    <div key={m.id} className="flex flex-col items-start gap-1">
                                        <p className="text-xs text-white pl-8">Avatar Rafik</p>
                                        <div className="flex items-start gap-2">
                                            <img src="./ai-20.png" alt="Rafik" className="w-6 h-6 rounded-full" />
                                            <p className="bg-[var(--color-primary)] text-[var(--color-primary-dark)] px-3 py-2 rounded-lg">{m.text}</p>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MaleModal;


