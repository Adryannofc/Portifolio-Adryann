import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline, ULink, Button, Magnetic } from './primitives';
import { useI18n } from '../contexts/I18nContext';

const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
              <WhatsAppIcon />
              WhatsApp
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
