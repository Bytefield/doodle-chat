'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';

export default function Home() {
  const { messages, isLoading, isSending, error, sendMessage, retry, currentUser } = useChat();

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      <header className="p-4 border-b bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold">Doodle Chat</h1>
        </div>
      </header>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm text-center flex items-center justify-center gap-3">
          <span>{error}</span>
          <button
            onClick={retry}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : (
            <MessageList messages={messages} currentUser={currentUser} />
          )}
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} isLoading={isSending} />
        </div>
      </footer>
    </div>
  );
}
