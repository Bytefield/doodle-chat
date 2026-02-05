'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/message';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message, index) => {
        const isOwn = message.author === currentUser;
        const prevMessage = messages[index - 1];
        const showAuthor = !prevMessage || prevMessage.author !== message.author;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={isOwn}
            showAuthor={showAuthor}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
