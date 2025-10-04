
import { useState } from "react";
import "./conversation.css";
import InputBox from "../inputbox/inputBox";
import FormatResponse from "../../hooks/formatResponse";
import type { Message, MessagePayload } from "../../types/types";

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "user", text: "Hey Rafik, can you give me a quick recap?" },
    { sender: "ai", text: "Sure! The team finalized the new color scheme...", done: true },
  ]);

  const handleMessageSent = ({ userMessage, aiResponse, files, response, doneMessageId }: MessagePayload) => {
    const newMessages: Message[] = [];

    if (userMessage) {
      newMessages.push({
        sender: "user",
        text: userMessage,
        files: files || null,
      });
    }

    if (response) {
      // Append streaming chunk content with de-duplication by chunk_id
      setMessages((prev) => {
        const lastAi = [...prev].reverse().find((m) => m.sender === "ai");

        if (lastAi && lastAi.message_id === response.message_id) {
          // If we've already processed this chunk_id, ignore duplicate
          if (lastAi.chunk_id === response.chunk_id) {
            return prev;
          }
          // Support both cumulative and delta streaming formats
          return prev.map((m) => {
            if (m.message_id !== response.message_id) return m;
            const existing = m.text || "";
            const incoming = response.content || "";
            const nextText = incoming.startsWith(existing)
              ? incoming // cumulative full text from server
              : (existing + (existing ? " " : "") + incoming).trim(); // delta append
            return {
              ...m,
              text: nextText,
              chunk_id: response.chunk_id,
              metadata: response.metadata,
              done: m.done ?? false,
            };
          });
        } else {
          // First chunk of a new AI message
          return [
            ...prev,
            {
              sender: "ai",
              text: response.content,
              message_id: response.message_id,
              chunk_id: response.chunk_id,
              metadata: response.metadata,
              done: false,
            },
          ];
        }
      });
      return;
    }

    // Mark a message as completed when done signal is received
    if (doneMessageId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === doneMessageId ? { ...m, done: true } : m
        )
      );
      return;
    }

    if (aiResponse) {
      newMessages.push({
        sender: "ai",
        text: aiResponse,
        done: true,
      });
    }

    setMessages((prev) => [...prev, ...newMessages]);
  };

  return (
    <div className="w-full h-screen bg-[#efffec] flex flex-col">
      {/* Header */}
      <div className="text-center conversation border-b flex-shrink-0">
        <h1 className="conversation-heading">VoxoConnect AI Assistant</h1>
        <p className="conversation-para">
          Ask questions about your company information
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col-reverse space-y-4 space-y-reverse">
        {[...messages].reverse().map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            } chat-box`}
          >
            <img
              src={msg.sender === "user" ? "/Rectangle 34.png" : "/ai-20.png"}
              alt={msg.sender}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div
              className={`p-3 rounded-lg max-w-lg ${
                msg.sender === "user"
                  ? "bg-white border-r-4 border-r-[#102d0b]"
                  : "bg-white border-l-4 border-l-[#102d0b]"
              }`}
            >
              {msg.sender === "ai" ? (
                <div className="text-sm text-gray-800 flex items-start gap-2">
                  <div className="flex-1"><FormatResponse text={msg.text} /></div>
                  {!msg.done && (
                    <div className="w-4 h-4 mt-0.5 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#102D0B]"></div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-800">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex-shrink-0 bg-[#efffec]">
        <InputBox onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
};

export default Conversation;
