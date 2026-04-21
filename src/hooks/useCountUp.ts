import { useEffect, useRef, useState } from 'react';

interface Options {
  duration?: number;
  threshold?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  { duration = 1200, threshold = 0.4 }: Options = {},
) {
  const ref = useRef<T | null>(null);
  const reducedInitial = prefersReducedMotion();
  const [value, setValue] = useState(reducedInitial ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let frame = 0;
    let start = 0;
    let fired = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(easeOut(t) * target));
      if (t < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired) {
            fired = true;
            frame = window.requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [target, duration, threshold]);

  return { ref, value };
}
