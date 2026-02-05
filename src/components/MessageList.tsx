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
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    // Only auto-scroll when new messages are added
    if (messages.length > prevMessagesLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
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
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="pt-4 pb-[var(--bubble-padding)]"
    >
      <ul className="flex flex-col gap-[var(--bubble-gap)]">
        {messages.map((message, index) => {
          const isOwn = message.author === currentUser;
          const prevMessage = messages[index - 1];
          const showAuthor = !prevMessage || prevMessage.author !== message.author;

          return (
            <li key={message._id}>
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
