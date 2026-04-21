import type { CSSProperties } from 'react';
import type { CaseStudyContent, Project } from '../../data/projects';
import { Media } from '../primitives';
import { useParallax } from '../../hooks/useParallax';

interface Props {
  project: Project;
  cs: CaseStudyContent;
}

export function CaseHeader({ project, cs }: Props) {
  const h1Ref = useParallax<HTMLHeadingElement>({ speed: 0.15 });
  const shotRef = useParallax<HTMLDivElement>({ speed: 0.25 });

  return (
    <section className="case-section case-header" id="case-sec-01">
      <div className="case-container">
        <div className="case-header-grid">
          <div className="case-header-main">
            <span className="case-overline reveal">// CASE STUDY · {cs.n}</span>
            <h1 className="case-h1" ref={h1Ref}>
              {cs.h1Lines.map((line, i) => (
                <span key={line}>
                  <span
                    className="mask-reveal"
                    style={{ ['--reveal-delay' as string]: `${i * 120}ms` } as CSSProperties}
                  >
                    <span>{line}</span>
                  </span>
                  {i < cs.h1Lines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p
              className="case-tagline reveal"
              style={{ ['--reveal-delay' as string]: '240ms' } as CSSProperties}
            >
              {cs.tagline}
            </p>
            <div className="case-meta-row">
              {[
                { k: 'YEAR', v: project.year },
                { k: 'ROLE', v: project.role.toUpperCase() },
                { k: 'STATUS', v: project.status, live: true },
              ].map((item, i, arr) => (
                <span key={item.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                  <span
                    className="reveal"
                    style={{ ['--reveal-delay' as string]: `${360 + i * 80}ms` } as CSSProperties}
                  >
                    {item.k} ·{' '}
                    {item.live && <span className="live-dot" aria-hidden />}
                    {item.v}
                  </span>
                  {i < arr.length - 1 && <span className="sep">|</span>}
                </span>
              ))}
            </div>
          </div>

          <div ref={shotRef} className="case-hero-shot-outer">
            <div
              className="case-hero-shot reveal"
              style={{ ['--reveal-delay' as string]: '200ms' } as CSSProperties}
              data-cursor="preview"
            >
              <Media label="[ PROJECT HERO SHOT ]" meta="16 : 9" fill />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
