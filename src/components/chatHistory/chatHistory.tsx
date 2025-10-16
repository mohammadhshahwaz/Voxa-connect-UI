import React, { useState } from "react";
import { ChevronDown, History} from "lucide-react";

interface ChatItem {
  id: string;
  title: string;
}

const ChatHistory: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState({
    recent: true,
    past15: true,
    older: true,
  });

  const recentChats: ChatItem[] = [
    { id: "1", title: "After running smart sche..." },
    { id: "2", title: "Why is it important to add..." },
    { id: "3", title: "If I see a Channel overlap..." },
  ];

  const toggle = (key: keyof typeof open) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Show Toggle Button only when panel is closed */}
      {!isOpen && (
        <button
          className={`bg-[#2D3142] text-white rounded flex items-center gap-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl ${
            isHovered ? "px-6 py-3" : "p-3"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleButtonClick}
          style={{ borderRadius: "8px 0 0 8px" }}
        >
          <span
            className={`font-medium whitespace-pre transition-all duration-300 ${
              isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            Chat History
          </span>
          <History className="flex-shrink-0" />
        </button>
      )}

      {/* Full Chat History Panel */}
      {isOpen && (
        <div className="w-72 bg-[#2D3142] rounded-lg shadow-2xl text-[#E3E5EB] flex flex-col h-[500px] mt-2">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-[#3E4254]">
            <button onClick={handleButtonClick}>
              <img src="/backhistory.svg" alt="back" className="h-8 w-8" />
            </button>
            <span className="text-base font-semibold">Chat History</span>
            <History className="h-5 w-5 text-[#B9BBC6] ml-auto" />
            
          </div>

          {/* New Chat Button */}
          <div className="px-4 py-4">
            <button className="w-full bg-white text-[#2D3142] py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-gray-100 transition-all shadow-sm">
              New Chat
              {/* <MessageSquare className="h-4 w-4" /> */}
              <img src="/chat-svg.svg" className="h-8 w-8" alt="chat image" />
            </button>
          </div>

          {/* Scrollable Chat List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* Recent */}
            <div className="mb-4">
              <button
                onClick={() => toggle("recent")}
                className="w-full flex justify-between items-center text-sm text-[#B9BBC6] hover:text-white transition-all py-2"
              >
                <span className="font-medium">Recent</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open.recent ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open.recent && (
                <div className="mt-2 space-y-1">
                  {recentChats.map((chat) => (
                    <button
                      key={chat.id}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-[#B9BBC6] hover:bg-[#3B4054] hover:text-white transition-all"
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Past 15 Days */}
            <div className="mb-4">
              <button
                onClick={() => toggle("past15")}
                className="w-full flex justify-between items-center text-sm text-[#B9BBC6] hover:text-white transition-all py-2"
              >
                <span className="font-medium">Past 15 Days</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open.past15 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open.past15 && (
                <div className="pl-3 mt-2 text-xs text-[#6B7280] italic">
                  No chats
                </div>
              )}
            </div>

            {/* Older */}
            <div>
              <button
                onClick={() => toggle("older")}
                className="w-full flex justify-between items-center text-sm text-[#B9BBC6] hover:text-white transition-all py-2"
              >
                <span className="font-medium">Older</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open.older ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open.older && (
                <div className="pl-3 mt-2 text-xs text-[#6B7280] italic">
                  No chats
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHistory;
