import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { useI18n } from '../contexts/I18nContext';
import { SectionHead } from './Header';
import { TESTIMONIALS, STATS } from '../data/testimonials';
import type { Stat } from '../data/testimonials';

interface StatItemProps {
  stat: Stat;
  label: string;
  delay: number;
}

function StatItem({ stat, label, delay }: StatItemProps) {
  const { ref, value } = useCountUp<HTMLDivElement>(stat.value, {
    duration: 1400,
    delay,
  });
  return (
    <div
      className="social-stat reveal"
      style={{ ['--reveal-delay' as string]: `${delay}ms` } as CSSProperties}
      ref={ref}
    >
      <span className="social-stat__value">
        {value}
        {stat.suffix ?? ''}
      </span>
      <span className="social-stat__label mono">{label}</span>
    </div>
  );
}

export function Social() {
  const { t, locale } = useI18n();
  const ref = useReveal<HTMLElement>();

  return (
    <section id="social" className="social" ref={ref} data-screen-label="03 Social">
      <SectionHead
        index="03 /"
        eyebrow={t.social.eyebrow}
        title={
          <span className="mask-reveal">
            <span>{t.social.h2}</span>
          </span>
        }
      />

      <div className="social-stats">
        {STATS.map((s, i) => (
          <StatItem
            key={s.label}
            stat={s}
            label={locale === 'pt-BR' ? s.labelPt : s.label}
            delay={i * 120}
          />
        ))}
      </div>

      {TESTIMONIALS.length > 0 && (
        <div className="depo-grid">
          {TESTIMONIALS.map((d, i) => (
            <article
              key={d.id}
              className="depo-card reveal"
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` } as CSSProperties}
            >
              <blockquote className="depo-quote">
                <p>"{locale === 'pt-BR' ? d.quotePt : d.quote}"</p>
              </blockquote>
              <footer className="depo-author">
                {d.avatar ? (
                  <img
                    src={d.avatar}
                    alt={d.name}
                    className="depo-avatar"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="depo-avatar depo-avatar--initials" aria-hidden="true">
                    {d.name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                )}
                <div className="depo-author-info">
                  <span className="depo-name">{d.name}</span>
                  <span className="depo-role mono">
                    {d.role} · {d.business}
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
