import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, ULink, Button, Magnetic } from './primitives';
import { useI18n } from '../contexts/I18nContext';

export function Contact() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="contact" className="contact" ref={ref} data-screen-label="07 Contact">
      <div className="contact-inner">
        <Overline>{t.contact.eyebrow}</Overline>

        <h2 className="contact-display">
          <span className="mask-reveal">
            <span>{t.contact.h2[0]}</span>
          </span>
          <br />
          <span
            className="mask-reveal"
            style={{ '--reveal-delay': '90ms' } as CSSProperties}
          >
            <span>{t.contact.h2[1]}</span>
          </span>
          <br />
          <span
            className="mask-reveal"
            style={{ '--reveal-delay': '180ms' } as CSSProperties}
          >
            <span>
              {t.contact.h2[2]}
              <span className="contact-arrow">&#x27F6;</span>
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <Magnetic strength={0.25}>
            <Button href="https://wa.me/558781209267" variant="primary" arrow>
              Whastapp
            </Button>
          </Magnetic>
          <Magnetic strength={0.2}>
            <Button href="https://cal.com" variant="ghost" arrow>
              {t.contact.calendar}
            </Button>
          </Magnetic>
        </div>

        <div className="contact-grid">
          <div>
            <Overline>{t.contact.elsewhere}</Overline>
            <ul className="contact-links">
              <li>
                <ULink href="https://github.com/Adryannofc" external>
                  GitHub
                </ULink>
              </li>
              <li>
                <ULink href="https://www.linkedin.com/in/adryann-felix-7a3b4925b/" external>
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
            <Overline>{t.contact.based}</Overline>
            <div className="mono contact-based">
              Foz do Iguaçu, BR
              <br />
              {String.fromCharCode(0x2014)}25.54° S, {String.fromCharCode(0x2014)}54.58° W
              <br />
              GMT-03
            </div>
          </div>
        </div>

        <footer className="site-footer mono">
          <span>&#169; ADRYANN FELIX · {new Date().getFullYear()}</span>
          <span>{t.footer.built}</span>
          <span>
            <a href="#top" data-cursor="link">
              {t.footer.backToTop}
            </a>
          </span>
        </footer>
      </div>
    </section>
  );
}
