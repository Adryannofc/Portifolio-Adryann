import { useRef, useEffect, type CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline } from './primitives';
import { SectionHead } from './Header';

export function About() {
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
    <section id="about" className="about" ref={ref} data-screen-label="05 About">
      <SectionHead index="06 /" eyebrow="ABOUT · BIO" title="" />

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
            <span>FOZ DO IGUAÇU · BR</span>
            <span>SHOT BY — TBD</span>
          </div>
        </div>

        <div className="about-copy">
          <p
            className="h2 about-quote reveal"
            style={{ ['--reveal-delay' as string]: '80ms' } as CSSProperties}
          >
            I treat software the way{' '}
            <span className="about-em">a typographer treats a paragraph</span> — every detail is
            either doing work, or it’s in the way.
          </p>

          <div
            className="about-body reveal"
            style={{ ['--reveal-delay' as string]: '160ms' } as CSSProperties}
          >
            <p>
              I’m Adryann — a software engineer from Foz do Iguaçu, on the Brazilian tri-border. I
              build web products for clients who want the craft of a product team without the
              payroll of one.
            </p>
            <p>
              My last five years have been a quiet specialization: the seam between design intent
              and production code. I work solo or embedded, asynchronously, across PT and EN, and I
              ship small every week.
            </p>
          </div>

          <div
            className="about-facts reveal"
            style={{ ['--reveal-delay' as string]: '220ms' } as CSSProperties}
          >
            <dl>
              <div>
                <dt>
                  <Overline>LANGUAGES</Overline>
                </dt>
                <dd>PT · EN · ES</dd>
              </div>
              <div>
                <dt>
                  <Overline>TIMEZONE</Overline>
                </dt>
                <dd>GMT-03</dd>
              </div>
              <div>
                <dt>
                  <Overline>FOCUS</Overline>
                </dt>
                <dd>Web apps · marketing sites · internal tools</dd>
              </div>
              <div>
                <dt>
                  <Overline>AVOIDING</Overline>
                </dt>
                <dd>Crypto · gambling · AI slop</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
