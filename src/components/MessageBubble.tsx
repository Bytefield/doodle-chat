'use client';

import { Message } from '@/types/message';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAuthor?: boolean;
}

export function MessageBubble({ message, isOwn, showAuthor = true }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {showAuthor && !isOwn && (
          <p className="text-xs font-medium text-gray-500 mb-1">
            {message.author}
          </p>
        )}
        <p className="break-words">{message.message}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
