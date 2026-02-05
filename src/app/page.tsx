'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';

export default function Home() {
  const { messages, isLoading, isSending, error, sendMessage, retry, currentUser } = useChat();
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (error && retryButtonRef.current) {
      retryButtonRef.current.focus();
    }
  }, [error]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
    setAnnouncement('Message sent');
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return (
    <div className="flex flex-col h-dvh">
      <a
        href="#message-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--color-primary)] focus:rounded focus:font-medium"
      >
        Skip to message input
      </a>
      <header className="h-[var(--header-height)] shrink-0 p-4 bg-[var(--color-primary)] flex items-center justify-center">
        <h1 className="text-xl font-semibold text-white">Doodle Chat</h1>
      </header>

      {error && (
        <div
          role="alert"
          className="p-3 bg-red-100 text-red-700 text-sm text-center flex items-center justify-center gap-3"
        >
          <span>{error}</span>
          <button
            ref={retryButtonRef}
            onClick={retry}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <main
        className="flex-1 min-h-0 overflow-hidden"
        style={{ backgroundImage: 'url(/bg.png)', backgroundRepeat: 'repeat' }}
      >
        <div className="h-full max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding)]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 bg-white/80 px-4 py-2 rounded">Loading messages...</p>
            </div>
          ) : (
            <MessageList messages={messages} currentUser={currentUser} />
          )}
        </div>
      </main>

      <footer className="h-[var(--footer-height)] shrink-0 bg-[var(--color-primary)] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-[var(--container-max-width)] mx-auto md:px-[var(--container-padding)]">
          <ChatInput onSend={handleSendMessage} isLoading={isSending} />
        </div>
      </footer>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
