import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { PROJECTS, type Project } from '../data/projects';
import { Overline, Media, Button } from './primitives';
import { SectionHead } from './Header';

interface ProjectCardProps {
  p: Project;
  i: number;
  onEnter: (i: number) => void;
}

function ProjectCard({ p, i, onEnter }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            onEnter(i);
          }
        }),
      { root: el.closest('.rail-scroll'), threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [i, onEnter]);

  const style = { ['--reveal-delay' as string]: `${i * 60}ms` } as CSSProperties;
  const hasCase = Boolean(p.caseStudy && p.slug);

  const inner = (
    <>
      <div className="proj-card-media">
        <Media label={`${p.n} · ${p.title.toUpperCase()}`} meta={p.tag.toUpperCase()} fill />
        <div className="proj-card-meta-top">
          <span className="mono proj-card-n">{p.n}</span>
          <span className={`proj-status proj-status-${p.status.toLowerCase()}`}>
            <span className="proj-status-dot" />
            {p.status}
          </span>
        </div>
      </div>

      <div className="proj-card-body">
        <h3 id={`p-${p.n}-title`} className="proj-card-title">
          {p.title}
        </h3>
        <p className="proj-card-desc">{p.desc}</p>

        <div className="proj-card-foot">
          <div className="proj-card-stack">
            {p.stack.map((s) => (
              <span key={s} className="mono stack-tag">
                {s}
              </span>
            ))}
          </div>
          <div className="proj-card-role">
            <Overline>ROLE</Overline>
            <div className="mono proj-card-role-v">{p.role}</div>
          </div>
        </div>
      </div>
    </>
  );

  if (hasCase) {
    return (
      <Link
        to={`/work/${p.slug}`}
        ref={cardRef as unknown as React.Ref<HTMLAnchorElement>}
        className="proj-card reveal"
        style={style}
        data-cursor="view"
        aria-labelledby={`p-${p.n}-title`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article
      ref={cardRef}
      className="proj-card reveal"
      style={style}
      data-cursor="view"
      aria-labelledby={`p-${p.n}-title`}
    >
      {inner}
    </article>
  );
}

export function Work() {
  const ref = useReveal<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    on();
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  return (
    <section id="work" className="work" ref={ref} data-screen-label="02 Work">
      <div className="work-head">
        <SectionHead
          index="02 /"
          eyebrow="SELECTED WORK · 2023 — 2025"
          title={
            <span>
              <span className="mask-reveal">
                <span>Five projects,</span>
              </span>
              <br />
              <span
                className="mask-reveal"
                style={{ ['--reveal-delay' as string]: '100ms' } as CSSProperties}
              >
                <span>five problems.</span>
              </span>
            </span>
          }
          right={
            <div className="work-head-meta">
              <span className="mono work-counter">
                <span className="work-counter-n">{String(active + 1).padStart(2, '0')}</span>
                <span className="work-counter-sep">/</span>
                <span className="work-counter-t">{String(PROJECTS.length).padStart(2, '0')}</span>
              </span>
              <div className="work-progress">
                <div
                  className="work-progress-fill"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>
          }
        />
      </div>

      <div className="work-rail">
        <div className="rail-scroll" ref={scrollRef} data-cursor="drag">
          <div className="rail-track">
            {PROJECTS.map((p, i) => (
              <ProjectCard p={p} i={i} key={p.n} onEnter={setActive} />
            ))}
            <div className="rail-end">
              <Overline>END OF RAIL</Overline>
              <div className="h2" style={{ marginTop: 12, maxWidth: 320 }}>
                Want yours here next?
              </div>
              <Button href="#contact" variant="primary" style={{ marginTop: 24 }}>
                Start a project
              </Button>
            </div>
          </div>
        </div>

        <div className="work-controls">
          <button
            className="rail-btn"
            onClick={() => scrollBy(-1)}
            aria-label="Previous project"
            data-cursor="link"
          >
            <span className="mono">←</span>
          </button>
          <button
            className="rail-btn"
            onClick={() => scrollBy(1)}
            aria-label="Next project"
            data-cursor="link"
          >
            <span className="mono">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
