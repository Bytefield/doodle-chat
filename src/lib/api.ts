import { Message } from '@/types/message';

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL;
}

function getApiToken() {
  return process.env.NEXT_PUBLIC_API_TOKEN;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${getApiUrl()}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiToken()}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export interface GetMessagesParams {
  limit?: number;
  after?: string;
  before?: string;
}

export async function getMessages(params?: GetMessagesParams): Promise<Message[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.after) searchParams.set('after', params.after);
  if (params?.before) searchParams.set('before', params.before);

  const query = searchParams.toString();
  const endpoint = `/api/v1/messages${query ? `?${query}` : ''}`;

  return fetchApi<Message[]>(endpoint);
}

export async function sendMessage(message: string, author: string): Promise<Message> {
  return fetchApi<Message>('/api/v1/messages', {
    method: 'POST',
    body: JSON.stringify({ message, author }),
  });
}
