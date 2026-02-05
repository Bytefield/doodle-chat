import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMessages, sendMessage } from '../api';

const mockMessages = [
  {
    id: '1',
    message: 'Hello',
    author: 'Alice',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    message: 'Hi there',
    author: 'Bob',
    createdAt: '2024-01-01T10:01:00Z',
  },
];

describe('api', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_API_TOKEN', 'test-token');
    vi.restoreAllMocks();
  });

  describe('getMessages', () => {
    it('fetches messages successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMessages),
      });

      const messages = await getMessages();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/messages',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(messages).toEqual(mockMessages);
    });

    it('passes pagination params as query string', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getMessages({ limit: 10, after: '2024-01-01T10:00:00Z' });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/messages?limit=10&after=2024-01-01T10%3A00%3A00Z',
        expect.any(Object)
      );
    });

    it('throws on 401 unauthorized', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(getMessages()).rejects.toThrow('Unauthorized');
    });

    it('throws on other errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getMessages()).rejects.toThrow('API error: 500');
    });
  });

  describe('sendMessage', () => {
    it('sends message and returns created message', async () => {
      const newMessage = {
        id: '3',
        message: 'Test message',
        author: 'Alice',
        createdAt: '2024-01-01T10:02:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(newMessage),
      });

      const result = await sendMessage('Test message', 'Alice');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'Test message', author: 'Alice' }),
        })
      );
      expect(result).toEqual(newMessage);
    });

    it('throws on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(sendMessage('Test', 'Alice')).rejects.toThrow('Network error');
    });
  });
});
