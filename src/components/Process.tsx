import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline } from './primitives';
import { SectionHead } from './Header';

interface ProcessStep {
  n: string;
  phase: string;
  title: string;
  desc: string;
  deliverables: string[];
  days: string;
}

const PROCESS: ProcessStep[] = [
  {
    n: '01',
    phase: 'ORIENT',
    title: 'Understand the business before the pixels.',
    desc:
      'A half-day together. We map the actual constraint — revenue, time, audience. If a landing page isn’t the answer, I say so.',
    deliverables: ['Brief · written', 'Scope + risks', 'Go / no-go'],
    days: '1—2 days',
  },
  {
    n: '02',
    phase: 'SHAPE',
    title: 'Design in the browser, not in isolation.',
    desc:
      'Low-fi flows → hi-fi in Figma → hi-fi in a Next.js sandbox. Decisions stick earlier because nothing is hypothetical.',
    deliverables: ['Flow map', 'Hi-fi key screens', 'Live sandbox URL'],
    days: '1—2 weeks',
  },
  {
    n: '03',
    phase: 'BUILD',
    title: 'Ship it small, ship it often.',
    desc:
      'Production-grade from day one. Preview deploys on every PR. You can see and touch progress without a meeting.',
    deliverables: ['Staging URL · daily', 'Weekly walkthrough', 'Loom + written updates'],
    days: '2—6 weeks',
  },
  {
    n: '04',
    phase: 'HAND OFF',
    title: 'Leave you better than I found you.',
    desc:
      'Docs your next engineer actually reads. Monitoring wired up. A month of care included — no surprises, no invoices.',
    deliverables: ['README · honest', 'Monitoring + alerts', '30 days of support'],
    days: '1 week',
  },
];

export function Process() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="process" className="process" ref={ref} data-screen-label="04 Process">
      <SectionHead
        index="04 /"
        eyebrow="PROCESS · HOW I WORK"
        title={
          <>
            <span className="mask-reveal">
              <span>Four phases.</span>
            </span>{' '}
            <span
              className="mask-reveal"
              style={{ ['--reveal-delay' as string]: '100ms' } as CSSProperties}
            >
              <span>Zero drama.</span>
            </span>
          </>
        }
        right={<span className="mono">~ 3 to 8 weeks typical</span>}
      />

      <div className="process-list">
        {PROCESS.map((p, i) => (
          <div
            className="process-row reveal"
            key={p.n}
            style={{ ['--reveal-delay' as string]: `${i * 80}ms` } as CSSProperties}
          >
            <div className="process-n mono">{p.n}</div>
            <div className="process-body">
              <div className="process-phase">
                <Overline>{p.phase}</Overline>
                <span className="mono process-days">{p.days}</span>
              </div>
              <h3 className="process-title">{p.title}</h3>
              <p className="process-desc">{p.desc}</p>
              <div className="process-deliv mono">
                {p.deliverables.map((d, j) => (
                  <span key={d}>
                    {d}
                    {j < p.deliverables.length - 1 && <span className="process-sep">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
