import { useState, useRef } from 'react';
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

function DepoCard({
  d,
  locale,
}: {
  d: (typeof TESTIMONIALS)[number];
  locale: string;
}) {
  return (
    <>
      <blockquote className="depo-quote">
        <p>"{locale === 'pt-BR' ? d.quotePt : d.quote}"</p>
      </blockquote>
      <footer className="depo-author">
        {d.avatar ? (
          <img src={d.avatar} alt={d.name} className="depo-avatar" width={48} height={48} />
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
    </>
  );
}

function MobileCoverflow({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const swiped = useRef(false);
  const n = TESTIMONIALS.length;

  return (
    <div
      className="coverflow reveal"
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
        swiped.current = false;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 50) {
          swiped.current = true;
          if (dx < 0) setActive((a) => Math.min(a + 1, n - 1));
          else setActive((a) => Math.max(a - 1, 0));
        }
      }}
    >
      <div className="coverflow-track">
        {TESTIMONIALS.map((d, i) => {
          const offset = i - active;
          const cls = [
            'depo-card',
            'coverflow-slide',
            offset === 0 ? 'active' : offset < 0 ? 'pre' : 'following',
          ].join(' ');
          return (
            <article
              key={d.id}
              className={cls}
              onClick={() => {
                if (!swiped.current && offset !== 0) setActive(i);
              }}
              aria-hidden={offset !== 0 ? true : undefined}
            >
              <DepoCard d={d} locale={locale} />
            </article>
          );
        })}
      </div>

      <div className="coverflow-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`coverflow-dot${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Depoimento ${i + 1}`}
          />
        ))}
      </div>
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

      {/* Desktop: 2-column grid */}
      {TESTIMONIALS.length > 0 && (
        <div className="depo-grid">
          {TESTIMONIALS.map((d, i) => (
            <article
              key={d.id}
              className="depo-card reveal"
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` } as CSSProperties}
            >
              <DepoCard d={d} locale={locale} />
            </article>
          ))}
        </div>
      )}

      {/* Mobile: coverflow carousel */}
      {TESTIMONIALS.length > 0 && <MobileCoverflow locale={locale} />}
    </section>
  );
}
