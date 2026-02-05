'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-2">
      <input
        id="message-input"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message"
        aria-label="Message input"
        disabled={isLoading}
        className="flex-1 h-10 px-2 py-4 text-base bg-white border border-[#2e77a4] rounded focus:outline-none focus:ring-2 focus:ring-[#2e77a4] disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        aria-label="Send message"
        className="h-10 px-6 bg-[#e85d3a] text-white text-base rounded hover:opacity-90 disabled:bg-[#ff876d] disabled:cursor-not-allowed transition-opacity"
      >
        Send
      </button>
    </div>
  );
}
