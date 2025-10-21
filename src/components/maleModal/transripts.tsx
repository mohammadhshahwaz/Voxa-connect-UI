import React from 'react';

interface ChatEntryProps {
  locale: string;
  timestamp: number;
  message: string;
  messageOrigin: 'local' | 'remote';
  hasBeenEdited: boolean;
}
export const ChatEntry = React.forwardRef<HTMLDivElement, ChatEntryProps>(
  ({ locale, timestamp, message, messageOrigin, hasBeenEdited, ...props }, ref) => {
    const isUser = messageOrigin === 'local';

    return (
      <div ref={ref} {...props}>
        {isUser ? (
          // User message (right-aligned)
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-white pr-8">You</p>
            <div className="flex items-start gap-2">
              <p className="bg-white text-[var(--color-primary-dark)] px-3 py-2 rounded-lg">
                {message}
              </p>
              <img 
                src="./Rectangle 34.png" 
                alt="You" 
                className="w-6 h-6 rounded-full" 
              />
            </div>
            {hasBeenEdited && (
              <p className="text-xs text-white/50 pr-8">(edited)</p>
            )}
          </div>
        ) : (
          // Avatar message (left-aligned)
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs text-white pl-8">Avatar Rafik</p>
            <div className="flex items-start gap-2">
              <img 
                src="./ai-20.png" 
                alt="Rafik" 
                className="w-6 h-6 rounded-full" 
              />
              <p className="bg-[var(--color-primary)] text-[var(--color-primary-dark)] px-3 py-2 rounded-lg">
                {message}
              </p>
            </div>
            {hasBeenEdited && (
              <p className="text-xs text-white/50 pl-8">(edited)</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ChatEntry.displayName = 'ChatEntry';