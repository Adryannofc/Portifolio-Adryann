import { useEffect, useRef, useState } from 'react';

type CursorCtx = 'default' | 'link' | 'external' | 'view' | 'drag' | 'preview' | 'read';

export function Cursor() {
  const outer = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const [ctx, setCtx] = useState<CursorCtx>('default');
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const o = outer.current;
    const ic = inner.current;
    if (!o || !ic) return;

    let tx = 0;
    let ty = 0;
    let ix = 0;
    let iy = 0;
    let raf = 0;

    const loop = () => {
      tx += (ix - tx) * 0.18;
      ty += (iy - ty) * 0.18;
      o.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      ic.style.transform = `translate3d(${ix}px, ${iy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      setHidden(false);
      ix = e.clientX;
      iy = e.clientY;
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = (target?.dataset.cursor ?? 'default') as CursorCtx;
      setCtx((prev) => (prev === next ? prev : next));
    };
    const onLeave = () => setHidden(true);
    const onDown = () => o.classList.add('down');
    const onUp = () => o.classList.remove('down');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div
        ref={outer}
        className={`cursor cursor-outer ctx-${ctx}`}
        data-hidden={hidden}
        aria-hidden
      >
        <span className="cursor-label mono">
          {ctx === 'view' && 'VIEW'}
          {ctx === 'link' && '→'}
          {ctx === 'external' && '↗'}
          {ctx === 'drag' && 'DRAG'}
          {ctx === 'preview' && 'PREVIEW'}
          {ctx === 'read' && 'READ'}
          {ctx === 'default' && ''}
        </span>
      </div>
      <div ref={inner} className="cursor cursor-inner" data-hidden={hidden} aria-hidden />
    </>
  );
}
