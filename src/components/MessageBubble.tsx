'use client';

import { Message } from '@/types/message';

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': '\u00A0',
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&hellip;': '\u2026',
    '&copy;': '\u00A9',
  };
  return text
    .replace(/&\w+;/g, (match) => entities[match] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAuthor?: boolean;
}

export function MessageBubble({ message, isOwn, showAuthor = true }: MessageBubbleProps) {
  const date = new Date(message.createdAt);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[var(--bubble-max-width-s)] md:max-w-[var(--bubble-max-width-m)] p-[var(--bubble-padding)] rounded-lg border-[1.5px] border-[var(--color-bubble-border)] ${
          isOwn
            ? 'bg-[var(--color-bubble-own)]'
            : 'bg-[var(--color-bubble-other)]'
        }`}
      >
        {showAuthor && !isOwn && (
          <p className="text-[0.9rem] font-medium text-[var(--color-text-timestamp)] mb-1">
            {decodeHtmlEntities(message.author)}
          </p>
        )}
        <p className="break-words text-base text-[var(--color-text-message)]">{decodeHtmlEntities(message.message)}</p>
        <p
          className={`text-[0.9rem] mt-1 text-[var(--color-text-timestamp)] ${
            isOwn ? 'text-right pr-[0.5rem]' : 'text-left'
          }`}
        >
          {formattedDate} {formattedTime}
        </p>
      </div>
    </div>
  );
}
