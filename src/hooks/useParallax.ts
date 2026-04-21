import { useEffect, useRef } from 'react';

interface Options {
  speed?: number;
  axis?: 'x' | 'y';
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useParallax<T extends HTMLElement = HTMLElement>({
  speed = 0.15,
  axis = 'y',
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let frame = 0;
    let visible = false;
    let baseTop = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      baseTop = rect.top + window.scrollY;
    };

    const apply = () => {
      frame = 0;
      const delta = window.scrollY - baseTop;
      const offset = delta * speed;
      if (axis === 'x') {
        el.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!visible) return;
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible) {
            measure();
            onScroll();
          }
        });
      },
      { rootMargin: '200px 0px 200px 0px' },
    );

    io.observe(el);
    el.style.willChange = 'transform';
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.willChange = '';
      el.style.transform = '';
    };
  }, [speed, axis]);

  return ref;
}
