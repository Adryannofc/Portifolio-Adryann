import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, ULink } from './primitives';
import { SectionHead } from './Header';
import { useI18n } from '../contexts/I18nContext';

const SERVICE_NS = ['S/01', 'S/02', 'S/03'];

export function Services() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="services" className="services" ref={ref} data-screen-label="03 Services">
      <SectionHead
        index="03 /"
        eyebrow={t.services.eyebrow}
        title={
          <>
            <span className="mask-reveal">
              <span>{t.services.titleA}</span>
            </span>{' '}
            <span
              className="mask-reveal"
              style={{ ['--reveal-delay' as string]: '100ms' } as CSSProperties}
            >
              <span>{t.services.titleB}</span>
            </span>
          </>
        }
        right={<span className="mono services-caption">{t.services.caption}</span>}
      />

      <div className="services-grid">
        {t.services.items.map((s, i) => (
          <article
            key={SERVICE_NS[i]}
            className="svc reveal"
            style={{ ['--reveal-delay' as string]: `${i * 120}ms` } as CSSProperties}
          >
            <div className="svc-head">
              <Overline>{SERVICE_NS[i]}</Overline>
              <span className="mono svc-from">{s.from}</span>
            </div>
            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-desc">{s.desc}</p>

            <ul className="svc-list" aria-label={t.services.includes}>
              {s.delivers.map((d) => (
                <li key={d}>
                  <span className="svc-list-mark mono">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="svc-foot">
              <ULink href="#contact">{t.services.cta}</ULink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
