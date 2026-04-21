import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline } from './primitives';

export function Hero() {
  const ref = useReveal<HTMLElement>();

  const clients = [
    'UTI INFORMÁTICA',
    'DEVDEX',
    'CATARATAS PARK HOTEL',
    'SABOR DA FRONTEIRA',
    'INSTITUTO IGUAÇU SOCIAL',
  ];
  const tickerItems = [...clients, ...clients, ...clients];

  const delay = (ms: string): CSSProperties => ({ ['--reveal-delay' as string]: ms } as CSSProperties);

  return (
    <section id="top" className="hero" ref={ref} data-screen-label="Hero">
      <div className="hero-inner">
        <div className="hero-meta">
          <span className="mono hero-meta-tag">[ PORTFOLIO · 2026 ]</span>
          <span className="hero-meta-rule" />
          <span className="mono hero-meta-tag hero-meta-accent">
            <span className="amber-dot" aria-hidden /> ACCEPTING PROJECTS · Q2
          </span>
        </div>

        <h1 className="hero-display">
          <span className="mask-reveal" style={delay('60ms')}>
            <span>I ship web</span>
          </span>
          <br />
          <span className="mask-reveal" style={delay('160ms')}>
            <span>software that</span>
          </span>
          <br />
          <span className="mask-reveal" style={delay('260ms')}>
            <span>
              <span className="hero-arrow" aria-hidden>
                ⟶
              </span>
              &nbsp;feels inevitable.
            </span>
          </span>
        </h1>

        <div className="hero-grid">

        </div>

        <div className="hero-scroll-hint reveal" style={delay('820ms')}>
          <Overline>SCROLL ↓ · 01 / 07</Overline>
          <div className="hero-scroll-line">
            <div className="hero-scroll-line-fill" />
          </div>
        </div>
      </div>

      <div className="hero-marquee" aria-hidden>
        <div className="hero-marquee-track">
          {tickerItems.map((t, i) => (
            <span className="hero-marquee-item mono" key={i}>
              {t}
              <span className="hero-marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
