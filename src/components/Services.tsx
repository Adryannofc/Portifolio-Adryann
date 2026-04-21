import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, ULink } from './primitives';
import { SectionHead } from './Header';

interface Service {
  n: string;
  title: string;
  desc: string;
  delivers: string[];
  from: string;
}

const SERVICES: Service[] = [
  {
    n: 'S/01',
    title: 'Product engineering',
    desc: 'End-to-end: from the type scale to the database schema. Best when there is no existing design team — or the handoff loss is killing you.',
    delivers: [
      'Figma → production in one loop',
      'Accessible UI system',
      'Observable deploys',
      'Docs the next dev can read',
    ],
    from: 'from R$ 12k / engagement',
  },
  {
    n: 'S/02',
    title: 'Landing & conversion',
    desc: 'Single-page sites engineered for speed and conversion. LCP under 1.2s, CLS near zero, SEO local done properly.',
    delivers: [
      'Copy + design + dev',
      'CMS or static, your call',
      '90+ Lighthouse across four metrics',
      'Analytics + A/B lane',
    ],
    from: 'from R$ 4k / page',
  },
  {
    n: 'S/03',
    title: 'Retainer · design-engineer',
    desc: 'An embedded pair of hands for product teams. Ship small things weekly, fix the things that feel off, raise the quality bar.',
    delivers: [
      '20h / week baseline',
      'Async-first · PT/EN',
      'Component system care',
      'Weekly ship log',
    ],
    from: 'from R$ 8k / month',
  },
];

export function Services() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="services" className="services" ref={ref} data-screen-label="03 Services">
      <SectionHead
        index="03 /"
        eyebrow="SERVICES · 2026"
        title={
          <>
            <span className="mask-reveal">
              <span>How we can work</span>
            </span>{' '}
            <span
              className="mask-reveal"
              style={{ ['--reveal-delay' as string]: '100ms' } as CSSProperties}
            >
              <span>together.</span>
            </span>
          </>
        }
        right={<span className="mono services-caption">03 shapes — pick the one that fits</span>}
      />

      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <article
            key={s.n}
            className="svc reveal"
            style={{ ['--reveal-delay' as string]: `${i * 120}ms` } as CSSProperties}
          >
            <div className="svc-head">
              <Overline>{s.n}</Overline>
              <span className="mono svc-from">{s.from}</span>
            </div>
            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-desc">{s.desc}</p>

            <ul className="svc-list" aria-label="What is included">
              {s.delivers.map((d) => (
                <li key={d}>
                  <span className="svc-list-mark mono">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="svc-foot">
              <ULink href="#contact">Start a conversation</ULink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
