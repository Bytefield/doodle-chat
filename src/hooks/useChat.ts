'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/types/message';
import { getMessages, sendMessage as sendMessageApi } from '@/lib/api';

const CURRENT_USER = 'User';
const POLL_INTERVAL = 3000;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageTime = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      setMessages(data);
      if (data.length > 0) {
        lastMessageTime.current = data[data.length - 1].createdAt;
      }
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.log('fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pollNewMessages = useCallback(async () => {
    if (!lastMessageTime.current) return;

    try {
      const newMessages = await getMessages({ after: lastMessageTime.current });
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
        lastMessageTime.current = newMessages[newMessages.length - 1].createdAt;
      }
    } catch (err) {
      // silently fail on poll errors
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const interval = setInterval(pollNewMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [pollNewMessages]);

  const sendMessage = async (text: string) => {
    setIsSending(true);
    try {
      const newMessage = await sendMessageApi(text, CURRENT_USER);
      setMessages((prev) => [...prev, newMessage]);
      lastMessageTime.current = newMessage.createdAt;
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
