import { useEffect, useState } from "react";
import type { GenerateToken } from "../types/types";
import { config } from "../config/config";


export function useLivekitToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const raw = localStorage.getItem("auth");
        let username = "guest";

        if (raw) {
          const user = JSON.parse(raw);
          username = user?.username || "guest";
        }

        const tokenData = await getGenerateToken({
          name: username,
          api_key: config.livekitapiKey,
          api_secret: config.livekitapiSecret,
        } as GenerateToken);

        if (tokenData?.token) {
          console.log(" Successfully generated LiveKit token");
          setToken(tokenData.token);
        } else {
          console.warn(" Token not found in response:", tokenData);
        }
      } catch (err) {
        console.error(" Error fetching token:", err);
      }
    };

    fetchToken();
  }, []);

  return token;
}

const TOKEN_WS_URL = config.livekitwsUrl || "ws://localhost:8003/ws/livekit";

export function connectLivekitSocket(
  agentName: string,
  onMessage?: (msg: any) => void
) {
  console.log("Connecting to WebSocket:", TOKEN_WS_URL);
  const ws = new WebSocket(TOKEN_WS_URL);
  ws.binaryType = 'arraybuffer';

  ws.onopen = () => {
    console.log(" Connected to LiveKit WebSocket");
    ws.send(JSON.stringify({ type: "get_token", agent_name: agentName }));
  };

  ws.onmessage = async (event) => {
    try {
      let textPayload: string | null = null;
      if (typeof event.data === 'string') {
        textPayload = event.data;
      } else if (event.data instanceof ArrayBuffer) {
        textPayload = new TextDecoder().decode(event.data);
      } else if (event.data && typeof (event.data as any).arrayBuffer === 'function') {
        const buf = await (event.data as Blob).arrayBuffer();
        textPayload = new TextDecoder().decode(buf);
      }

      let msg: any = null;
      if (textPayload) {
        try {
          msg = JSON.parse(textPayload);
        } catch {
          // forward as raw transcript-like text for consumers that can parse strings
          msg = textPayload;
        }
      } else {
        msg = event.data;
      }

      if (msg && (msg as any)?.type === "token_response") {
        console.log("LiveKit Token received:", (msg as any).data);
      }

      onMessage?.(msg);
    } catch (e) {
      console.warn("Failed to handle WebSocket message:", e);
      onMessage?.(null);
    }
  };

  ws.onclose = () => console.log("Disconnected from server");
  ws.onerror = (err) => console.error("WebSocket Error:", err);

  return ws;
}


export async function getGenerateToken(
  data: GenerateToken
): Promise<GenerateToken | null> {
  try {
    const base = "http://98.90.206.21:8003";
    const params = new URLSearchParams();

    if (data?.name) params.set("name", data.name);
    if (data?.api_key) params.set("api_key", data.api_key);
    if ((data as any)?.api_secret)
      params.set("api_secret", (data as any).api_secret);

    const url = `${base}/api/v1/tokens/generate/livekit${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate token: ${response.status} ${response.statusText}`
      );
    }

    const result: GenerateToken = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Error generating token:", error);
    return null;
  }
}
