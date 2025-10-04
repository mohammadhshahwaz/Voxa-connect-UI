export interface ChatMetadata {
  model: string;
  tokens_used: number;
  latency_ms: number;
}

export interface ChatResponse {
  message_id: string;
  chunk_id: string;
  content: string;
  metadata: ChatMetadata;
}

export interface ChatRequestBody {
  type: "chat_response";
  session_id: string;
  timestamp: string; // ISO string
  response: ChatResponse;
  ack?: {
    status: string;
    original_message_id: string;
  };
}

// Message stored in UI
export interface Message {
  sender: "user" | "ai";
  text: string;
  files?: string[] | null;
  message_id?: string;
  chunk_id?: string;
  metadata?: ChatMetadata;
  done?: boolean; // whether streaming is finished for this AI message
}

// Payload passed from InputBox -> Conversation
export interface MessagePayload {
  userMessage?: string;
  aiResponse?: string;
  files?: string[];
  response?: ChatResponse;
  doneMessageId?: string; // signal that streaming is finished for this message_id
}
