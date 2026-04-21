import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, Media } from './primitives';
import { SectionHead } from './Header';

export function About() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="about" className="about" ref={ref} data-screen-label="05 About">
      <SectionHead index="06 /" eyebrow="ABOUT · BIO" title="" />

      <div className="about-grid">
        <div className="about-portrait reveal">
          <Media label="PORTRAIT · TBD" meta="16:21" ratio="4 / 5" />
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
