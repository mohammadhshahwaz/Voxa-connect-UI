import { useState } from "react";
import "./conversation.css";
import InputBox from "../inputbox/inputBox";

import FormatResponse from "../../hooks/formatResponse";
import type { Message, MessagePayload } from "../../types/types";
// import { History } from "lucide-react";
import ChatHistory from "../chatHistory/chatHistory";


const Conversation: React.FC = () => {
  // const [openHistory, setOpenHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hi, I’m Rafik. Here to help you with anything you need. What can I do for you today?",
      done: true,
    },
  ]);

  const handleMessageSent = ({
    userMessage,
    aiResponse,
    files,
    response,
    doneMessageId,
  }: MessagePayload) => {
    const newMessages: Message[] = [];

    if (userMessage) {
      newMessages.push({
        sender: "user",
        text: userMessage,
        files: files || null,
      });
    }

    if (response) {
      setMessages((prev) => {
        const lastAi = [...prev].reverse().find((m) => m.sender === "ai");

        if (lastAi && lastAi.message_id === response.message_id) {
          if (lastAi.chunk_id === response.chunk_id) return prev;

          return prev.map((m) => {
            if (m.message_id !== response.message_id) return m;
            const existing = m.text || "";
            const incoming = response.content || "";
            const nextText = incoming.startsWith(existing)
              ? incoming
              : (existing + incoming).trim();
            return {
              ...m,
              text: nextText,
              chunk_id: response.chunk_id,
              metadata: response.metadata,
              done: m.done ?? false,
            };
          });
        } else {
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
    <div className="w-full h-screen relative bg-[var(--color-bg-light-sec)] flex flex-col">
      {/* Header */}
      <div className="  flex flex-row conversation border-b border-[var(--color-line-dark)] flex-shrink-0 bg-[var(--color-bg-light)]">
        <h1 className="conversation-heading text-[var(--color-primary-dark)] font-bold text-lg">
          VoxaConnect AI Assistant
        </h1>
      </div>

      <div className=" absolute top-24 right-0 overflow-hidden">
        <ChatHistory />
      </div>
      {/* Sidebar (Chat History) */}


      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col-reverse space-y-4 space-y-reverse">

        {[...messages].reverse().map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              } chat-box`}
          >
            <img
              src={msg.sender === "user" ? "/placeholder.png" : "/placeholder.png"}
              alt={msg.sender}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div
              className={`p-3 rounded-lg max-w-lg text-sm ${msg.sender === "user"
                ? "bg-[var(--bg-white)] border-r-4 border-[var(--color-primary-dark)]"
                : "bg-[var(--bg-white)] border-l-4 border-[var(--color-primary-dark)]"
                } user-`}
            >
              {msg.sender === "ai" ? (
                <div className="text-[var(--color-neutral-dark)] flex items-start gap-2">
                  <div className="flex-1">
                    <FormatResponse text={msg.text} />
                  </div>
                  {!msg.done && (
                    <div className="w-4 h-4 mt-0.5 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary-dark)]"></div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[var(--color-neutral-dark)]">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex-shrink-0 bg-[var(--color-bg-light)]">
        <InputBox onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
};

export default Conversation;
