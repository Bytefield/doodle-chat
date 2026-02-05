import { useState, useEffect, RefObject } from 'react';

export function useScrollbarWidth(ref: RefObject<HTMLElement | null>) {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkScrollbar = () => {
      const hasScrollbar = element.scrollHeight > element.clientHeight;
      if (hasScrollbar) {
        // scrollbar width = total width - visible content width
        const width = element.offsetWidth - element.clientWidth;
        setScrollbarWidth(width);
      } else {
        setScrollbarWidth(0);
      }
    };

    // Check initially
    checkScrollbar();

    // Re-check on resize and content changes
    const resizeObserver = new ResizeObserver(checkScrollbar);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return scrollbarWidth;
}
