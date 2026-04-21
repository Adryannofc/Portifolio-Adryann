import { useEffect, useRef, type CSSProperties } from 'react';
import type { CaseStudyContent, RoadmapItem } from '../../data/projects';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

interface Props {
  cs: CaseStudyContent;
}

function RoadmapCard({ item, i }: { item: RoadmapItem; i: number }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (isCoarsePointer()) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const applyTilt = () => {
      frame = 0;
      el.style.transform = `perspective(800px) rotateX(${ty}deg) rotateY(${tx}deg) translate3d(0, -4px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      tx = Math.max(-1, Math.min(1, dx)) * 6;
      ty = Math.max(-1, Math.min(1, -dy)) * 4;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--sx', `${x}%`);
      el.style.setProperty('--sy', `${y}%`);
      if (!frame) frame = window.requestAnimationFrame(applyTilt);
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
  }, []);

  return (
    <article
      ref={ref}
      className="case-roadmap-card reveal"
      style={{ ['--reveal-delay' as string]: `${i * 60}ms` } as CSSProperties}
      data-cursor="read"
    >
      <span className="case-roadmap-spot" aria-hidden />
      <span className={`case-priority-badge ${item.priority.toLowerCase()}`}>
        <span className="dot" />
        {item.priority}
      </span>
      <h3 className="case-roadmap-name">{item.name}</h3>
      <p className="case-roadmap-desc">{item.desc}</p>
      <div className="case-roadmap-foot">
        <span className="effort">{item.effort}</span>
        <span>{item.status}</span>
      </div>
    </article>
  );
}

export function CaseRoadmap({ cs }: Props) {
  return (
    <section className="case-section case-roadmap-section" id="case-sec-06">
      <div className="case-container">
        <span className="case-section-head">// ROADMAP · WHAT COMES NEXT</span>
        <p className="case-subhead">Features scoped out, ready to build.</p>

        <div className="case-roadmap-grid">
          {cs.roadmap.map((item, i) => (
            <RoadmapCard key={item.name} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
