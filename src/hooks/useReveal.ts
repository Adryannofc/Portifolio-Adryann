import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );
    el.querySelectorAll('.reveal, .mask-reveal').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
