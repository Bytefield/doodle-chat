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
    } catch {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pollNewMessages = useCallback(async () => {
    if (!lastMessageTime.current) return;

    try {
      const newMessages = await getMessages({ after: lastMessageTime.current });
      if (newMessages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const uniqueNew = newMessages.filter((m) => !existingIds.has(m._id));
          return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
        });
        lastMessageTime.current = newMessages[newMessages.length - 1].createdAt;
      }
    } catch {
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
    } catch {
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const retry = () => {
    setIsLoading(true);
    setError(null);
    fetchMessages();
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    retry,
    currentUser: CURRENT_USER,
  };
}
