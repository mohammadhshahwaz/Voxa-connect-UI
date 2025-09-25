import { useState } from "react";
import { Send } from "lucide-react";
import './conversation.css';

const Conversation = () => {
  const [messages,] = useState([
    {
      sender: "user",
      text: "Hey Lina, can you give me a quick recap of yesterday's design review? I only caught the last five minutes.",
    },
    {
      sender: "ai",
      text: "Sure! The team finalized the new color scheme, agreed on font choices, and pushed the mobile layout to next sprint.",
    },
    {
      sender: "user",
      text: "That's great. What were the pending items from that meeting? Anything critical I should keep an eye on today?",
    },
    {
      sender: "ai",
      text: "Yes. You need to refine the onboarding flow screens, test the button states, and schedule a usability review session.",
    },
  ]);
  return (
    <div className="w-full min-h-screen bg-[#efffec] flex flex-col">
      {/* Header */}
      <div className="p-4 text-center conversation border-b">
        <h1 className="conversation-heading">VoxoConnect AI Assistant</h1>
        <p className="conversation-para ">
          Ask questions about your company information
        </p>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div
              className={`p-3 rounded-xl max-w-lg ${
                msg.sender === "user"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <p className="text-sm text-gray-800">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Input Box */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a new message here"
          className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button className="p-2 bg-[#d9fdd3] rounded-full">
          <Send size={18} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
export default Conversation