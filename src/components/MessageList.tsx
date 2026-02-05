'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/message';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    shouldScrollRef.current = isNearBottom;
  };

  useEffect(() => {
    if (shouldScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No messages yet
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="h-full overflow-y-auto p-4"
    >
      <ul className="space-y-2">
        {messages.map((message, index) => {
          const isOwn = message.author === currentUser;
          const prevMessage = messages[index - 1];
          const showAuthor = !prevMessage || prevMessage.author !== message.author;

          return (
            <li key={message.id}>
              <MessageBubble
                message={message}
                isOwn={isOwn}
                showAuthor={showAuthor}
              />
            </li>
          );
        })}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
}
