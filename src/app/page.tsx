'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';

export default function Home() {
  const { messages, isLoading, isSending, error, sendMessage, currentUser } = useChat();

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Doodle Chat</h1>
      </header>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : (
        <MessageList messages={messages} currentUser={currentUser} />
      )}

      <ChatInput onSend={sendMessage} isLoading={isSending} />
    </div>
  );
}
