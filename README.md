# Doodle Chat

A simple chat application built with Next.js.

## Setup

```bash
pnpm install
pnpm dev
```

The app runs on `http://localhost:3001` by default.

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TOKEN=super-secret-doodle-token
```

## Design Notes

### Color Accessibility

The challenge provided mockup images but no color specifications or style guide. I extracted colors directly from the mockups using a color picker. After implementation, I ran a WCAG contrast analysis and found several combinations that don't meet AA standards:

| Element | Contrast Ratio | WCAG AA (4.5:1) |
|---------|---------------|-----------------|
| Header text (white on cyan) | 2.81:1 | Fails |
| Send button text (white on orange) | 2.53:1 | Fails |
| Timestamps (gray on yellow/white) | ~1.8:1 | Fails |
| Author name (gray on white) | 1.94:1 | Fails |
| Message text (dark gray on yellow) | 8.05:1 | Passes |
| Message text (dark gray on white) | 9.06:1 | Passes |

I chose to follow the provided design rather than modify colors, but this is something I would flag in a real project and discuss with the design team to find accessible alternatives that maintain brand consistency.

### Scrollbar and Margins

The design specifies 24px margins on both sides of the message container. These margins are respected in the implementation, but the browser's native scrollbar can make the right margin appear smaller visually. I opted for an overlay scrollbar (thin, semi-transparent) to minimize this effect while maintaining native scroll behavior.

Alternative approaches considered:
- `scrollbar-gutter: stable` - reserves space but adds visual asymmetry
- Custom scrollbar libraries - adds dependencies for a minor visual issue
- Hiding scrollbar completely - hurts usability

### Timestamp Alignment Inconsistency

The design specs show an inconsistency in timestamp positioning:
- Received messages: timestamp aligned at 16px from the left (matching author name and message)
- Sent messages: timestamp at 8px from the right edge

I followed the specs as provided, but this creates a slight visual inconsistency between sent and received messages.

### Header Design

No reference image was provided for the header. I assumed a simple centered title based on the overall design context and color scheme.
