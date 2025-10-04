// import { useRef } from "react";

// const InputBox = () => {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     const handleUploadClick = () => {
//         fileInputRef.current?.click();
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             console.log("Selected files:", files);
//         }
//     };

//     return (
//         <div>
//             <div className="m-3 flex sticky bottom-0 items-center gap-3 border-2 bg-[#D4FFCD] text-[#102d0b] font-semibold rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
//                 <input
//                     type="text"
//                     placeholder="Type a new message here"
//                     className="flex-1 px-4 py-1 h-12 outline-none border-none"
//                 />

//                 {/* Upload Document Button */}
//                 <button className="upload-document" onClick={handleUploadClick}>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="40"
//                         height="40"
//                         viewBox="0 0 50 50"
//                         fill="none"
//                     >
//                         <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M19.8093 10.6044C24.7138 5.9097 32.6439 5.9097 37.5485 10.6044C42.4838 15.3286 42.4838 23.0117 37.5485 27.7359L24.3017 40.4159C20.8183 43.7503 15.1922 43.7503 11.7088 40.4159C8.19449 37.052 8.19448 31.5744 11.7088 28.2105L24.7649 15.7129C26.8273 13.7388 30.1493 13.7388 32.2117 15.7129C34.3048 17.7165 34.3048 20.9886 32.2117 22.9923L19.0602 35.5811C18.5615 36.0584 17.7702 36.0411 17.2929 35.5424C16.8155 35.0437 16.8328 34.2525 17.3315 33.7751L30.4829 21.1863C31.5477 20.167 31.5477 18.5381 30.4829 17.5189C29.3873 16.4701 27.5893 16.4701 26.4936 17.5189L13.4375 30.0165C10.9516 32.396 10.9516 36.2304 13.4375 38.6099C15.9542 41.019 20.0563 41.019 22.573 38.6099L35.8198 25.9299C39.7267 22.1901 39.7267 16.1502 35.8198 12.4104C31.882 8.64104 25.4758 8.64104 21.538 12.4104L10.8644 22.6274C10.3657 23.1047 9.57438 23.0875 9.09701 22.5887C8.61964 22.09 8.63694 21.2988 9.13565 20.8214L19.8093 10.6044Z"
//                             fill="#102D0B"
//                         />
//                     </svg>
//                 </button>

//                 {/* Hidden File Input */}
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     onChange={handleFileChange}
//                     multiple
//                 />

//                 {/* Send Button */}
//                 <button className="mx-1">
// <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="40"
//     height="40"
//     viewBox="0 0 50 50"
//     fill="none"
// >
//     <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M20.4652 11.5875L31.7412 16.6607C35.1689 18.2029 37.8666 19.4165 39.6966 20.5659C41.5042 21.7011 42.9167 23.047 42.9167 25C42.9167 26.953 41.5042 28.299 39.6966 29.4342C37.8666 30.5835 35.1689 31.7972 31.7413 33.3393L20.4652 38.4125C18.3702 39.3551 16.7403 40.0884 15.4677 40.5643C14.2224 41.03 13.1094 41.3358 12.1198 41.2282C9.71942 40.9672 7.65393 39.3212 7.15403 36.9973C6.94215 36.0124 7.23842 34.9106 7.66407 33.7661C8.10479 32.581 8.80526 31.0594 9.69763 29.1209L9.7217 29.0686C10.4191 27.5535 10.6875 26.9557 10.8245 26.3593C11.0305 25.4621 11.0305 24.5379 10.8245 23.6407C10.6875 23.0443 10.4191 22.4465 9.7217 20.9314L9.69763 20.8792C8.80526 18.9407 8.10479 17.4191 7.66407 16.234C7.23841 15.0894 6.94216 13.9876 7.15403 13.0027C7.65393 10.6789 9.71942 9.03287 12.1198 8.77185C13.1094 8.66423 14.2224 8.97006 15.4677 9.43574C16.7403 9.91163 18.3702 10.6449 20.4652 11.5875ZM14.5921 11.7774C13.3685 11.3198 12.7434 11.2188 12.3901 11.2572C10.9099 11.4181 9.84104 12.3992 9.59812 13.5285C9.55292 13.7386 9.58448 14.2257 10.0073 15.3626C10.4111 16.4483 11.071 17.8841 11.9926 19.886C12.0128 19.9299 12.0328 19.9732 12.0525 20.0161C12.6708 21.3589 13.0593 22.2024 13.2611 23.0812C13.5516 24.3466 13.5516 25.6534 13.2611 26.9188C13.0593 27.7977 12.6708 28.6412 12.0525 29.984C12.0328 30.0268 12.0128 30.0701 11.9926 30.114C11.071 32.116 10.4111 33.5517 10.0073 34.6375C9.58448 35.7744 9.55292 36.2614 9.59812 36.4716C9.84104 37.6008 10.9099 38.5819 12.3901 38.7428C12.7434 38.7812 13.3685 38.6802 14.5921 38.2227C15.7793 37.7787 17.335 37.0795 19.4846 36.1123L30.6144 31.1049C34.1649 29.5075 36.7019 28.3628 38.367 27.3171C40.0726 26.2459 40.4167 25.5501 40.4167 25C40.4167 24.45 40.0726 23.7541 38.367 22.683C36.7019 21.6372 34.1649 20.4925 30.6144 18.8951L19.4846 13.8877C17.335 12.9206 15.7793 12.2213 14.5921 11.7774Z"
//         fill="#102D0B"
//     />
// </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InputBox;



import { useEffect, useRef, useState } from "react";
import type { MessagePayload, ChatRequestBody } from "../../types/types";

interface InputBoxProps {
  onMessageSent?: (payload: MessagePayload) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onMessageSent }) => {
  const [message, setMessage] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string>("");
  const userIdRef = useRef<string>("");
  const awaitingFirstChunkRef = useRef<boolean>(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  const idleDebounceRef = useRef<number | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const lastChunkIdRef = useRef<string | null>(null);
  const lastContentLengthRef = useRef<number>(0);

  // WebSocket endpoint for streaming chat
  const WS_URL = "ws://98.90.206.21:8003/api/v1/chat_stream";
  // How long to wait without new tokens before considering a reply complete
  const STREAM_IDLE_MS = 10000;

  // Generate light-weight UUID v4-ish (sufficient for client-generated ids)
  const genId = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  // Initialize session_id and user_id once
  useEffect(() => {
    sessionIdRef.current = genId();
    try {
      const existing = localStorage.getItem("vc_user_id");
      if (existing) {
        userIdRef.current = existing;
      } else {
        const uid = `user_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem("vc_user_id", uid);
        userIdRef.current = uid;
      }
    } catch {
      // Fallback if localStorage is unavailable
      if (!userIdRef.current) userIdRef.current = `user_${Math.random().toString(36).slice(2, 10)}`;
    }
  }, []);

  // Cleanup timers and socket on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (idleDebounceRef.current) {
        clearTimeout(idleDebounceRef.current);
        idleDebounceRef.current = null;
      }
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        try { wsRef.current.close(); } catch {}
      }
    };
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedFiles((prev) => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])]);

  const removeFile = (i: number) => setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    // Immediately reflect user's message in UI (with filenames if any)
    const fileNames = selectedFiles.map((f) => f.name);
    onMessageSent?.({ userMessage: message, files: fileNames });

    setIsLoading(true);
    awaitingFirstChunkRef.current = true;
    currentMessageIdRef.current = null;
    lastContentLengthRef.current = 0;
    lastChunkIdRef.current = null;
    // Fallback: auto-stop loader if nothing arrives within 20s
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (awaitingFirstChunkRef.current) {
        awaitingFirstChunkRef.current = false;
        setIsLoading(false);
      }
    }, 20000);
    // Clear any previous idle debounce
    if (idleDebounceRef.current) {
      clearTimeout(idleDebounceRef.current);
      idleDebounceRef.current = null;
    }

    const sendOverWS = (ws: WebSocket) => {
      try {
        const payload = {
          type: "chat_message",
          session_id: sessionIdRef.current,
          user_id: userIdRef.current,
          timestamp: new Date().toISOString(),
          message: {
            content: message,
            metadata: {
              language: "en",
              channel: "web",
              // Include file names in metadata so backend can reference if desired
              files: fileNames,
            },
          },
        };
        ws.send(JSON.stringify(payload));
      } catch (e) {
        console.error("WS send error:", e);
        onMessageSent?.({ aiResponse: "Could not send message. Please try again." });
      }
    };

    const ensureSocket = () => {
      // Reuse an open socket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendOverWS(wsRef.current);
        return;
      }

      if (isConnectingRef.current) return; // avoid parallel connects
      isConnectingRef.current = true;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        isConnectingRef.current = false;
        sendOverWS(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data: ChatRequestBody = JSON.parse(event.data);
          if (data && data.type === "chat_response" && data.response) {
            // We are now receiving response chunks for this message
            if (awaitingFirstChunkRef.current) {
              awaitingFirstChunkRef.current = false;
              // cancel the 20s no-first-chunk fallback timer since we started receiving
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
              }
            }

            // Establish current message_id on first response
            if (!currentMessageIdRef.current) {
              currentMessageIdRef.current = data.response.message_id;
              lastContentLengthRef.current = (data.response.content || "").length;
            } else if (currentMessageIdRef.current === data.response.message_id) {
              // Only extend debounce if content grows (works for cumulative or delta)
              const len = (data.response.content || "").length;
              if (len > lastContentLengthRef.current) {
                lastContentLengthRef.current = len;
                if (idleDebounceRef.current) {
                  clearTimeout(idleDebounceRef.current);
                  idleDebounceRef.current = null;
                }
                idleDebounceRef.current = window.setTimeout(() => {
                  setIsLoading(false);
                  // Notify parent that current message finished streaming
                  if (currentMessageIdRef.current) {
                    onMessageSent?.({ doneMessageId: currentMessageIdRef.current });
                  }
                }, STREAM_IDLE_MS);
              }
            }
            onMessageSent?.({ response: data.response });
          }
        } catch (e) {
          console.warn("Non-JSON or unexpected WS message:", event.data);
          // Do not stop immediately on malformed frames; keep spinner until debounce/timeout/close
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        onMessageSent?.({ aiResponse: "Connection error. Please try again." });
        setIsLoading(false);
        if (currentMessageIdRef.current) {
          onMessageSent?.({ doneMessageId: currentMessageIdRef.current });
        }
      };

      ws.onclose = () => {
        isConnectingRef.current = false;
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        if (idleDebounceRef.current) {
          clearTimeout(idleDebounceRef.current);
          idleDebounceRef.current = null;
        }
        if (currentMessageIdRef.current) {
          onMessageSent?.({ doneMessageId: currentMessageIdRef.current });
        }
      };
    };

    ensureSocket();

    // Reset input and file chooser regardless of backend handling
    setMessage("");
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Clean up WS on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        try {
          wsRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);
    return (
        <div>
            {selectedFiles.length > 0 && (
                <div className="mx-3 mb-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-gray-300"
                        >
                            <span className="text-xs text-gray-700">{file.name}</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="m-3 flex sticky bottom-0 items-center gap-3 border-2 bg-[#D4FFCD] text-[#102d0b] font-semibold rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                <input
                    type="text"
                    placeholder="Type a new message here"
                    className="flex-1 px-4 py-1 h-12 outline-none border-none bg-transparent"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />

                {/* Upload Button with SVG */}
                <button
                    className="upload-document"
                    onClick={handleUploadClick}
                    disabled={isLoading}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 50 50"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.8093 10.6044C24.7138 5.9097 32.6439 5.9097 37.5485 10.6044C42.4838 15.3286 42.4838 23.0117 37.5485 27.7359L24.3017 40.4159C20.8183 43.7503 15.1922 43.7503 11.7088 40.4159C8.19449 37.052 8.19448 31.5744 11.7088 28.2105L24.7649 15.7129C26.8273 13.7388 30.1493 13.7388 32.2117 15.7129C34.3048 17.7165 34.3048 20.9886 32.2117 22.9923L19.0602 35.5811C18.5615 36.0584 17.7702 36.0411 17.2929 35.5424C16.8155 35.0437 16.8328 34.2525 17.3315 33.7751L30.4829 21.1863C31.5477 20.167 31.5477 18.5381 30.4829 17.5189C29.3873 16.4701 27.5893 16.4701 26.4936 17.5189L13.4375 30.0165C10.9516 32.396 10.9516 36.2304 13.4375 38.6099C15.9542 41.019 20.0563 41.019 22.573 38.6099L35.8198 25.9299C39.7267 22.1901 39.7267 16.1502 35.8198 12.4104C31.882 8.64104 25.4758 8.64104 21.538 12.4104L10.8644 22.6274C10.3657 23.1047 9.57438 23.0875 9.09701 22.5887C8.61964 22.09 8.63694 21.2988 9.13565 20.8214L19.8093 10.6044Z"
                            fill="#102D0B"
                        />
                    </svg>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    disabled={isLoading}
                />

                {/* Send Button with SVG */}
                <button
                    className="mx-1"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-10 h-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#102D0B]"></div>
                        </div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 50 50"
                            fill="none"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20.4652 11.5875L31.7412 16.6607C35.1689 18.2029 37.8666 19.4165 39.6966 20.5659C41.5042 21.7011 42.9167 23.047 42.9167 25C42.9167 26.953 41.5042 28.299 39.6966 29.4342C37.8666 30.5835 35.1689 31.7972 31.7413 33.3393L20.4652 38.4125C18.3702 39.3551 16.7403 40.0884 15.4677 40.5643C14.2224 41.03 13.1094 41.3358 12.1198 41.2282C9.71942 40.9672 7.65393 39.3212 7.15403 36.9973C6.94215 36.0124 7.23842 34.9106 7.66407 33.7661C8.10479 32.581 8.80526 31.0594 9.69763 29.1209L9.7217 29.0686C10.4191 27.5535 10.6875 26.9557 10.8245 26.3593C11.0305 25.4621 11.0305 24.5379 10.8245 23.6407C10.6875 23.0443 10.4191 22.4465 9.7217 20.9314L9.69763 20.8792C8.80526 18.9407 8.10479 17.4191 7.66407 16.234C7.23841 15.0894 6.94216 13.9876 7.15403 13.0027C7.65393 10.6789 9.71942 9.03287 12.1198 8.77185C13.1094 8.66423 14.2224 8.97006 15.4677 9.43574C16.7403 9.91163 18.3702 10.6449 20.4652 11.5875ZM14.5921 11.7774C13.3685 11.3198 12.7434 11.2188 12.3901 11.2572C10.9099 11.4181 9.84104 12.3992 9.59812 13.5285C9.55292 13.7386 9.58448 14.2257 10.0073 15.3626C10.4111 16.4483 11.071 17.8841 11.9926 19.886C12.0128 19.9299 12.0328 19.9732 12.0525 20.0161C12.6708 21.3589 13.0593 22.2024 13.2611 23.0812C13.5516 24.3466 13.5516 25.6534 13.2611 26.9188C13.0593 27.7977 12.6708 28.6412 12.0525 29.984C12.0328 30.0268 12.0128 30.0701 11.9926 30.114C11.071 32.116 10.4111 33.5517 10.0073 34.6375C9.58448 35.7744 9.55292 36.2614 9.59812 36.4716C9.84104 37.6008 10.9099 38.5819 12.3901 38.7428C12.7434 38.7812 13.3685 38.6802 14.5921 38.2227C15.7793 37.7787 17.335 37.0795 19.4846 36.1123L30.6144 31.1049C34.1649 29.5075 36.7019 28.3628 38.367 27.3171C40.0726 26.2459 40.4167 25.5501 40.4167 25C40.4167 24.45 40.0726 23.7541 38.367 22.683C36.7019 21.6372 34.1649 20.4925 30.6144 18.8951L19.4846 13.8877C17.335 12.9206 15.7793 12.2213 14.5921 11.7774Z"
                                fill="#102D0B"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputBox;
