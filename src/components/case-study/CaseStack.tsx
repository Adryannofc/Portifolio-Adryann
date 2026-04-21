import type { CSSProperties } from 'react';
import type { CaseStudyContent, StackEntry } from '../../data/projects';
import { useMagneticTilt } from '../../hooks/useMagneticTilt';

interface Props {
  cs: CaseStudyContent;
}

function StackCard({ s, i }: { s: StackEntry; i: number }) {
  const ref = useMagneticTilt<HTMLDivElement>({ maxX: 6, maxY: 4, lift: 4 });
  return (
    <div
      ref={ref}
      className="case-stack-card reveal"
      style={{ ['--reveal-delay' as string]: `${i * 60}ms` } as CSSProperties}
      data-cursor="read"
    >
      <div className="case-stack-card-inner">
        <div className="case-stack-icon" aria-hidden>
          {s.name.slice(0, 2).toUpperCase()}
        </div>
        <h3 className="case-stack-name">{s.name}</h3>
        <div className="case-stack-role">{s.role}</div>
        <div className="case-stack-divider" />
        <p className="case-stack-detail">{s.detail}</p>
      </div>
    </div>
  );
}

export function CaseStack({ cs }: Props) {
  return (
    <section className="case-section" id="case-sec-04">
      <div className="case-container">
        <span className="case-section-head">// STACK · IMPLEMENTATION</span>

        <div className="case-stack-grid">
          {cs.stack.map((s, i) => (
            <StackCard key={s.name} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
