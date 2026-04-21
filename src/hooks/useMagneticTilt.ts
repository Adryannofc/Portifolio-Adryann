import { useEffect, useRef } from 'react';

interface Options {
  maxX?: number;
  maxY?: number;
  perspective?: number;
  lift?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export function useMagneticTilt<T extends HTMLElement = HTMLElement>({
  maxX = 6,
  maxY = 4,
  perspective = 800,
  lift = 4,
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (isCoarsePointer()) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `perspective(${perspective}px) rotateX(${ty}deg) rotateY(${tx}deg) translate3d(0, -${lift}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      tx = Math.max(-1, Math.min(1, dx)) * maxX;
      ty = Math.max(-1, Math.min(1, -dy)) * maxY;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = '';
    };

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.transform = '';
      el.style.willChange = '';
      el.style.transformStyle = '';
    };
  }, [maxX, maxY, perspective, lift]);

  return ref;
}
