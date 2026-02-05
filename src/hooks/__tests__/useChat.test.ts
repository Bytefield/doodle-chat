import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useChat } from '../useChat';

const mockMessages = [
  {
    id: '1',
    message: 'Hello',
    author: 'Alice',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

vi.mock('@/lib/api', () => ({
  getMessages: vi.fn(),
  sendMessage: vi.fn(),
}));

import { getMessages, sendMessage } from '@/lib/api';

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches messages on mount', async () => {
    vi.mocked(getMessages).mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useChat());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(getMessages).toHaveBeenCalledOnce();
  });

  it('sends message and updates list', async () => {
    const newMessage = {
      id: '2',
      message: 'Test',
      author: 'User',
      createdAt: '2024-01-01T10:01:00Z',
    };

    vi.mocked(getMessages).mockResolvedValue(mockMessages);
    vi.mocked(sendMessage).mockResolvedValue(newMessage);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(sendMessage).toHaveBeenCalledWith('Test', 'User');
    expect(result.current.messages).toContainEqual(newMessage);
  });
});
