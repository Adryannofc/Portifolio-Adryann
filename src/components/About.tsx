import { useRef, useEffect, type CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline } from './primitives';
import { SectionHead } from './Header';
import { useI18n } from '../contexts/I18nContext';

export function About() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  const aboutPortraitRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = aboutPortraitRef.current;
    const section = el?.closest('section');
    if (!el || !section) return;
    let rafId: number;

    function frame() {
      const rect = section!.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el!.style.transform = `translateY(${progress * 40}px)`;
      }
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="about" className="about" ref={ref} data-screen-label="07 About">
      <SectionHead index="07 /" eyebrow={t.about.eyebrow} title="" />

      <div className="about-grid">
        <div className="about-portrait-col">
          <div className="about-portrait-wrap reveal">
            <img
              ref={aboutPortraitRef}
              src="/images/about-portrait.png"
              alt=""
              aria-hidden="true"
              className="about-portrait"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                mixBlendMode: 'screen',
                opacity: 0.88,
                pointerEvents: 'none',
                userSelect: 'none',
                maskImage: `
                  linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%),
                  linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)
                `,
                WebkitMaskImage: `
                  linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%),
                  linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              } as CSSProperties}
            />
          </div>
          <div className="mono about-portrait-cap">
            <span>{t.about.photoCaption}</span>
            <span>{t.about.photoCredit}</span>
          </div>
        </div>

        <div className="about-copy">
          <p
            className="h2 about-quote reveal"
            style={{ '--reveal-delay': '80ms' } as CSSProperties}
          >
            {t.about.quotePre}
            <span className="about-em">{t.about.quoteEm}</span>
            {t.about.quotePost}
          </p>

          <div
            className="about-body reveal"
            style={{ '--reveal-delay': '160ms' } as CSSProperties}
          >
            {t.about.bio.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div
            className="about-facts reveal"
            style={{ '--reveal-delay': '220ms' } as CSSProperties}
          >
            <dl>
              <div>
                <dt>
                  <Overline>{t.about.facts.languages}</Overline>
                </dt>
                <dd>PT · EN · ES</dd>
              </div>
              <div>
                <dt>
                  <Overline>{t.about.facts.timezone}</Overline>
                </dt>
                <dd>GMT-03</dd>
              </div>
              <div>
                <dt>
                  <Overline>{t.about.facts.focus}</Overline>
                </dt>
                <dd>{t.about.facts.focusVal}</dd>
              </div>
              <div>
                <dt>
                  <Overline>{t.about.facts.avoiding}</Overline>
                </dt>
                <dd>{t.about.facts.avoidingVal}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
