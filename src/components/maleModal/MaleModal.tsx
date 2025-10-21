

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Volume2, VolumeX } from "lucide-react";
import { connectLivekitSocket, getGenerateToken } from "../../services/aiAgent";
import { Room, RoomEvent, createLocalAudioTrack, createLocalVideoTrack, Track } from "livekit-client";
import { LiveKitRoom, RoomAudioRenderer, ParticipantTile, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";
import { config } from "../../config/config";

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
    const hasAutoStartedRef = useRef(false);
    const [started, setStarted] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);
    type ChatMsg = { id: string; role: "user" | "agent"; text: string };
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [remoteVideoActive, setRemoteVideoActive] = useState(false);
    const [, setIsAtBottom] = useState(true);

    const extractTranscript = (raw: any): { role: "user" | "agent"; text: string } | null => {
        try {
            // If it's a string, try to parse as JSON first, otherwise use as-is
            let msg = raw;
            if (typeof raw === 'string') {
                try {
                    msg = JSON.parse(raw);
                } catch {
                    // If not JSON, treat the entire string as text
                    if (raw.trim().length > 0) {
                        return { role: 'agent', text: raw.trim() };
                    }
                    return null;
                }
            }

            // Look for text in various possible locations
            const candidates = [
                msg?.text,
                msg?.content,
                msg?.message,
                msg?.transcript,
                msg?.data?.text,
                msg?.data?.content,
                msg?.data?.message,
                msg?.data?.transcript,
                msg?.payload?.text,
                msg?.payload?.content,
            ];

            const text = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
            if (!text) {
                console.log('No text found in message:', msg);
                return null;
            }

            // Determine role from message
            const role = (msg?.role === 'user' || msg?.role === 'agent') ? msg.role : 'agent';
            console.log('Extracted transcript: ', { role, text });
            return { role, text };
        } catch (error) {
            console.error('Error extracting transcript:', error);
            return null;
        }
    };

    const LiveKitAVLayer: React.FC = () => {
        const allCamTracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }]);
        const remoteCam = allCamTracks.filter((t) => !t.participant.isLocal);
        const mainRemote = remoteCam[0] || null;

        return (
            <>
                <RoomAudioRenderer />
                {/* Main Participant Video (fills container) */}
                {mainRemote ? (
                    <div className="w-full h-full">
                        <ParticipantTile trackRef={mainRemote} className="w-full h-full" />
                    </div>
                ) : (
                    <img
                        src="./placeholder.png"
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
                    src="./placeholder.png"
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
                        api_key: config.livekitapiKey,
                        api_secret: config.livekitapiSecret,
                    } as any);
                    console.log("Succesfully Generated LiveKit token ");
                    if (tokenData?.token) {
                        console.log("Token:");
                    } else {
                        console.warn("Token not found in response:");
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

    useEffect(() => {
        // auto scroll transcript in transcript section
        const transcriptContainer = document.getElementById("transcript");
        if (transcriptContainer) {
            const handleScroll = () => {
                const isScrollAtBottom = Math.abs(
                    transcriptContainer.scrollHeight -
                    (transcriptContainer.scrollTop + transcriptContainer.clientHeight)
                ) < 5; // Small threshold for floating point inaccuracies
                setIsAtBottom(isScrollAtBottom);
            };

            transcriptContainer.addEventListener("scroll", handleScroll);

            // Cleanup function to remove the event listener
            return () => {
                transcriptContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

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
                console.log("Received message:", msg);
                const parsed = extractTranscript(msg);
                if (parsed) {
                    setMessages((prev) => ([
                        ...prev,
                        { id: `${Date.now()}-${prev.length}`, role: parsed.role, text: parsed.text }
                    ]));
                }

                if (msg?.type === 'token_response') {
                    const token = msg?.data?.participantToken || msg?.data?.token || msg?.token;
                    const livekitUrl = config.livekitwsUrl;
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
                                    remoteVideoRef.current.srcObject = ms as any;
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

                            await room.connect(livekitUrl, token);
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
                    api_key: config.livekitapiKey,
                    api_secret: config.livekitapiSecret,
                } as any);

                const token = tokenData?.token;
                const livekitUrl = config.livekitwsUrl;
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

                            await room.connect(livekitUrl, token);
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

            // Register transcription handler once after connection (shared for both paths)
            if (roomRef.current) {
                console.log("Registering transcription handler...");
                try {
                    roomRef.current.registerTextStreamHandler('lk.transcription', async (reader, participantInfo) => {
                        console.log("Transcription handler fired for participant:", participantInfo.identity);
                        try {
                            let fullText = '';
                            // const isTranscription = reader.info?.attributes?.['lk.transcribed_track_id'] != null;
                            const segmentId = reader.info?.attributes?.['lk.segment_id'];
                            const role = participantInfo.identity.toLowerCase().includes('agent') ||
                                participantInfo.identity.toLowerCase().includes('avatar')
                                ? 'agent'
                                : 'user';

                            // Incremental read with async iterator for real-time chunks
                            for await (const chunk of reader) {
                                if (typeof chunk === 'string' && chunk.trim().length > 0) {
                                    fullText += chunk;
                                    // console.log(`📝 Interim chunk [segment=${segmentId}]: ${chunk} (role: ${role})`);
                                }
                            }

                            // Check if stream closed normally and has final flag
                            const isFinal = reader.info?.attributes?.['lk.transcription_final'] === 'true';
                            // console.log(`📝 Full stream [final=${isFinal}, isTranscription=${isTranscription}, text="${fullText}", role: ${role}]`);

                            if (isFinal && fullText.trim().length > 0) {
                                setMessages((prev) => [
                                    ...prev,
                                    {
                                        id: `${Date.now()}-${prev.length}-${segmentId || ''}`,
                                        role: role as "user" | "agent",
                                        text: fullText.trim()
                                    }
                                ]);
                            }

                        } catch (error) {
                            console.error('Error reading transcription stream:', error);
                        }
                    });
                    console.log("Transcription handler registered successfully");
                } catch (error) {
                    // Handle case where handler is already registered (only one allowed per topic)
                    if (error instanceof Error) {
                        if (error.message?.includes('already set') || error.message?.includes('handler')) {
                            console.log("Transcription handler already registered for this topic");
                        } else {
                            console.error("Error registering transcription handler:", error.message);
                        }
                    } else {
                        console.error("Unknown error registering transcription handler:", error);
                    }
                }
            }


            // Publish/enable local mic and camera (use LiveKit-created tracks for correct source types)
            try {
                const mic = await createLocalAudioTrack();
                await roomRef.current?.localParticipant.publishTrack(mic.mediaStreamTrack);
                const videoTracks = mediaRef.current?.getVideoTracks();
                if (videoTracks && videoTracks[0]) {
                    await roomRef.current?.localParticipant.publishTrack(videoTracks[0]);
                } else {
                    const cam = await createLocalVideoTrack();
                    await roomRef.current?.localParticipant.publishTrack(cam.mediaStreamTrack);
                }
                await roomRef.current?.localParticipant.setMicrophoneEnabled(true);
                await roomRef.current?.localParticipant.setCameraEnabled(true);
            } catch (e) {
                console.warn("Failed to publish local audio:", e);
            }

            setStarted(true);
        } catch (err) {
            console.error("Failed to start call:", err);
        }
    };

    // Auto-start the call when the modal mounts (guarded for StrictMode)
    useEffect(() => {
        if (!hasAutoStartedRef.current) {
            hasAutoStartedRef.current = true;
            handleStartCall();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleMic = () => {
        const tracks = mediaRef.current?.getAudioTracks() || [];
        const next = !micOn;
        tracks.forEach((t) => (t.enabled = next));
        setMicOn(next);
        try {
            roomRef.current?.localParticipant.setMicrophoneEnabled(next);
        } catch { }
    };

    const handleToggleCam = () => {
        const tracks = mediaRef.current?.getVideoTracks() || [];
        const next = !camOn;
        tracks.forEach((t) => (t.enabled = next));
        setCamOn(next);
        try {
            roomRef.current?.localParticipant.setCameraEnabled(next);
        } catch { }
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
        try {
            roomRef.current?.disconnect();
        } catch { }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            {/* Modal Container */}
            <div className="relative w-[95%] max-w-6xl gap-3 h-[80vh] flex  rounded-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleEndCall}
                    className="absolute top-3 right-3 text-white font-bold text-xl hover:text-red-500 z-50"
                >
                    ✕
                </button>

                {/* Left Section (Video Call) */}
                <div className="flex-1 relative bg-black rounded-2xl flex items-center justify-center">
                    {roomRef.current ? (
                        <LiveKitRoom room={roomRef.current} serverUrl="" token="" connect={true}>
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
                                    src="./placeholder.png"
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
                                        src="./placeholder.png"
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
                    <audio ref={remoteAudioRef} />
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
                                            <p className="bg-white text-[var(--color-primary-dark)] px-3 py-2 rounded-lg">
                                                {m.text}
                                                </p>
                                            <img src="./placeholder.png" alt="You" className="w-6 h-6 rounded-full" />
                                        </div>
                                    </div>
                                ) : (
                                    <div key={m.id} className="flex flex-col items-start gap-1">
                                        <p className="text-xs text-white pl-8">Avatar Rafik</p>
                                        <div className="flex items-start gap-2">
                                            <img src="./placeholder.png" alt="Rafik" className="w-6 h-6 rounded-full" />
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
