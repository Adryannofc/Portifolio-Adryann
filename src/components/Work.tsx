import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { PROJECTS, type Project } from '../data/projects';
import { Overline, Media, Button } from './primitives';
import { SectionHead } from './Header';
import { useI18n } from '../contexts/I18nContext';

interface ProjectCardProps {
  p: Project;
  i: number;
  onEnter: (i: number) => void;
}

function ProjectCard({ p, i, onEnter }: ProjectCardProps) {
  const { locale, t } = useI18n();
  const desc = locale === 'pt-BR' ? (p.descPt ?? p.desc) : p.desc;
  const role = locale === 'pt-BR' ? (p.rolePt ?? p.role) : p.role;
  const tag = locale === 'pt-BR' ? (p.tagPt ?? p.tag) : p.tag;
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
        <Media label={`${p.n} · ${p.title.toUpperCase()}`} meta={tag.toUpperCase()} fill />
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
        <p className="proj-card-desc">{desc}</p>

        <div className="proj-card-foot">
          <div className="proj-card-stack">
            {p.stack.map((s) => (
              <span key={s} className="mono stack-tag">
                {s}
              </span>
            ))}
          </div>
          <div className="proj-card-role">
            <Overline>{t.work.role}</Overline>
            <div className="mono proj-card-role-v">{role}</div>
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

const INITIAL_COUNT = 3;

export function Work() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!showAll) return;
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.proj-card');
    const target = cards[INITIAL_COUNT];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [showAll]);

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
          eyebrow={t.work.eyebrow}
          title={
            <span>
              <span className="mask-reveal">
                <span>{t.work.h2[0]}</span>
              </span>
              <br />
              <span
                className="mask-reveal"
                style={{ ['--reveal-delay' as string]: '100ms' } as CSSProperties}
              >
                <span>{t.work.h2[1]}</span>
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
            {(showAll ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT)).map((p, i) => (
              <ProjectCard p={p} i={i} key={p.n} onEnter={setActive} />
            ))}
            {!showAll && PROJECTS.length > INITIAL_COUNT && (
              <div className="rail-end rail-show-more" data-cursor="link">
                <Overline>{t.work.moreWork}</Overline>
                <div className="h2" style={{ marginTop: 12, maxWidth: 320 }}>
                  +{PROJECTS.length - INITIAL_COUNT}{' '}
                  {PROJECTS.length - INITIAL_COUNT === 1 ? t.work.moreSingular : t.work.morePlural}
                </div>
                <Button
                  variant="primary"
                  style={{ marginTop: 24 }}
                  onClick={() => setShowAll(true)}
                >
                  {t.work.showAll}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="work-controls">
          <button
            className="rail-btn"
            onClick={() => scrollBy(-1)}
            aria-label={t.work.prev}
            data-cursor="link"
          >
            <span className="mono">←</span>
          </button>
          <button
            className="rail-btn"
            onClick={() => scrollBy(1)}
            aria-label={t.work.next}
            data-cursor="link"
          >
            <span className="mono">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
