import { useEffect, useRef, useState } from 'react';

interface Options {
  speed?: number;
  threshold?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useTypewriter<T extends HTMLElement = HTMLElement>(
  target: string,
  { speed = 30, threshold = 0.35 }: Options = {},
) {
  const ref = useRef<T | null>(null);
  const reducedInitial = prefersReducedMotion();
  const [text, setText] = useState(reducedInitial ? target : '');
  const [done, setDone] = useState(reducedInitial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let timer: number | null = null;
    let i = 0;
    const run = () => {
      setText(target.slice(0, i));
      if (i >= target.length) {
        setDone(true);
        return;
      }
      i += 1;
      timer = window.setTimeout(run, speed);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [target, speed, threshold]);

  return { ref, text, done };
}
