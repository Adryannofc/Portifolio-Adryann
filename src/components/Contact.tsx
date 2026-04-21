import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, ULink, Button, Magnetic } from './primitives';

export function Contact() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="contact" className="contact" ref={ref} data-screen-label="07 Contact">
      <div className="contact-inner">
        <Overline>07 / CONTACT — LET’S TALK</Overline>

        <h2 className="contact-display">
          <span className="mask-reveal">
            <span>Got a project</span>
          </span>
          <br />
          <span
            className="mask-reveal"
            style={{ ['--reveal-delay' as string]: '90ms' } as CSSProperties}
          >
            <span>that deserves</span>
          </span>
          <br />
          <span
            className="mask-reveal"
            style={{ ['--reveal-delay' as string]: '180ms' } as CSSProperties}
          >
            <span>
              care
              <span className="contact-arrow">⟶</span>
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <Magnetic strength={0.25}>
            <Button href="mailto:hey@adryann.dev" variant="primary" arrow>
              hey@adryann.dev
            </Button>
          </Magnetic>
          <Magnetic strength={0.2}>
            <Button href="https://cal.com" variant="ghost" arrow>
              Book 30 min
            </Button>
          </Magnetic>
        </div>

        <div className="contact-grid">
          <div>
            <Overline>ELSEWHERE</Overline>
            <ul className="contact-links">
              <li>
                <ULink href="https://github.com" external>
                  GitHub
                </ULink>
              </li>
              <li>
                <ULink href="https://linkedin.com" external>
                  LinkedIn
                </ULink>
              </li>
              <li>
                <ULink href="https://read.cv" external>
                  Read.cv
                </ULink>
              </li>
              <li>
                <ULink href="https://are.na" external>
                  Are.na
                </ULink>
              </li>
            </ul>
          </div>
          <div>
            <Overline>DIRECT</Overline>
            <ul className="contact-links">
              <li>
                <ULink href="https://wa.me/5545999999999" external>
                  WhatsApp · +55 45
                </ULink>
              </li>
              <li>
                <ULink href="tel:+5545999999999">+55 45 9999-9999</ULink>
              </li>
            </ul>
          </div>
          <div>
            <Overline>BASED</Overline>
            <div className="mono contact-based">
              Foz do Iguaçu, BR
              <br />
              —25.54° S, —54.58° W
              <br />
              GMT-03
            </div>
          </div>
        </div>

        <footer className="site-footer mono">
          <span>© ADRYANN FELIX · {new Date().getFullYear()}</span>
          <span>BUILT IN THE BROWSER · NO TEMPLATES</span>
          <span>
            <a href="#top" data-cursor="link">
              BACK TO TOP ↑
            </a>
          </span>
        </footer>
      </div>
    </section>
  );
}
