'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/message';
import { getMessages, sendMessage as sendMessageApi } from '@/lib/api';

const CURRENT_USER = 'User';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.log('fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (text: string) => {
    setIsSending(true);
    try {
      const newMessage = await sendMessageApi(text, CURRENT_USER);
      setMessages((prev) => [...prev, newMessage]);
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      console.log('send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    currentUser: CURRENT_USER,
  };
}
