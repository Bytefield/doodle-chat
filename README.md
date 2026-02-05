# Doodle Chat

A real-time chat interface built as a frontend challenge. The goal was to replicate a provided design mockup pixel-perfectly while making sensible decisions where specs were ambiguous.

## Stack

- **Next.js 16** with App Router
- **React 19**
- **TailwindCSS 4** (using the new `@theme` syntax)
- **TypeScript**
- **Vitest** + React Testing Library

No component libraries. No state management libraries. Just React hooks and CSS.

## Setup

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:3001`.

### Environment

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TOKEN=super-secret-doodle-token
```

The app expects an API that returns messages in this shape:

```typescript
interface Message {
  _id: string;
  message: string;
  author: string;
  timestamp: string; // ISO date
}
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Design tokens + scrollbar styles
│   ├── layout.tsx       # Root layout with viewport config
│   └── page.tsx         # Main chat view
├── components/
│   ├── ChatInput.tsx    # Input field + send button
│   ├── MessageBubble.tsx # Individual message rendering
│   └── MessageList.tsx  # Message container with auto-scroll
├── hooks/
│   ├── useChat.ts       # API integration + state management
│   └── useScrollbarWidth.ts # Dynamic scrollbar detection
├── lib/
│   └── api.ts           # Fetch wrapper with error handling
└── types/
    └── message.ts       # TypeScript interfaces
```

## Technical Decisions

### Scrollbar Alignment Problem

This one was tricky. The design has a centered container (max 640px) with 24px padding. Messages and the input field should align perfectly.

**The problem**: When messages overflow, the native scrollbar appears and takes ~8-17px of space (varies by OS/browser). This shifts the message content to the left, breaking alignment with the footer input.

**What I tried**:
1. `scrollbar-gutter: stable` - Reserves space but creates asymmetric padding when there's no overflow
2. `overflow: overlay` - Deprecated, inconsistent browser support
3. Hiding the scrollbar - Works but hurts usability on desktop
4. Negative margin trick (`margin-right: -Xpx`) - Scrollbar wasn't visible in all cases

**The solution**: JavaScript detection. A `useScrollbarWidth` hook measures if the main element has overflow and calculates the exact scrollbar width. When a scrollbar is present, the message container's `padding-right` is reduced by that amount, so the content shifts right to stay aligned with the footer.

```typescript
// Simplified version
const hasScrollbar = element.scrollHeight > element.clientHeight;
const width = element.offsetWidth - element.clientWidth;

// Applied to message container
paddingRight: `calc(var(--container-padding) - ${scrollbarWidth}px)`
```

It's more code than a pure CSS solution, but it works reliably across browsers and viewport sizes.

### Scroll Behavior

The scroll container lives in `<main>`, not inside the message list. This keeps the scrollbar at the viewport edge rather than inside the padded content area.

Auto-scroll happens only when new messages arrive, not on initial load of historical messages. This prevents jarring jumps when the user is reading older messages.

### Design Token System

All measurements from the mockup are defined as CSS custom properties in `globals.css`:

```css
:root {
  --color-primary: #3798d4;
  --color-accent: #e85d3a;
  --container-max-width: 40rem;  /* 640px */
  --container-padding: 1.5rem;   /* 24px */
  --bubble-max-width-m: 26.25rem; /* 420px */
  --header-height: 3.5rem;       /* 56px */
  /* ... */
}
```

Makes it easy to tweak values without hunting through components.

### Responsive Breakpoints

- **S** (< 768px): Full-width layout, 8px edge padding on input
- **M+** (≥ 768px): Centered container, 24px padding matching messages

The transition is handled with Tailwind's `md:` prefix. No custom media queries needed.

## Design Notes

### Color Accessibility

The mockup didn't include a style guide, so I extracted colors with a picker. After implementing, I ran WCAG contrast checks:

| Element | Contrast | WCAG AA |
|---------|----------|---------|
| Header text (white on cyan) | 2.81:1 | ❌ Fails |
| Send button (white on orange) | 2.53:1 | ❌ Fails |
| Timestamps (gray on yellow) | ~1.8:1 | ❌ Fails |
| Author name (gray on white) | 1.94:1 | ❌ Fails |
| Message text (dark on yellow) | 8.05:1 | ✅ Passes |
| Message text (dark on white) | 9.06:1 | ✅ Passes |

I kept the original colors since this is a design replication challenge, but in a real project I'd push back on these with the design team.

### Timestamp Alignment Inconsistency

The specs show different timestamp positioning:
- Received messages: 16px from left (aligned with content)
- Sent messages: 8px from right edge

I followed the specs, but it creates a subtle visual inconsistency. Worth discussing with design.

### Header Assumption

No header mockup was provided. I went with a simple centered title using the primary color, matching the overall aesthetic.

## Accessibility

Despite the color contrast issues in the design, I added several a11y improvements:

- **Skip link**: Jump directly to message input
- **ARIA live regions**: Screen readers announce new messages and send confirmations
- **Focus management**: Error states auto-focus the retry button
- **Semantic markup**: `role="log"` on message list, proper button labels
- **Keyboard support**: Enter to send, full tab navigation
- **Safe area insets**: Respects notches and home indicators on mobile

## Testing

```bash
pnpm test        # Watch mode
pnpm test:run    # Single run
```

Tests cover:
- `useChat` hook: message fetching, sending, error states, optimistic updates
- `ChatInput`: rendering, submit behavior, disabled states
- `api` module: success/error responses, token handling

