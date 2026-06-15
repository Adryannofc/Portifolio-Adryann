import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { Tetris } from '../components/tetris/Tetris';

const WHATSAPP = 'https://wa.me/558781209267';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Adryannofc' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adryann-felix-7a3b4925b/' },
  { label: 'Read.cv', href: 'https://read.cv' },
  { label: 'Are.na', href: 'https://are.na' },
];

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="page-404">
      <header className="p404-header">
        <Link to="/" className="p404-brand" data-cursor="link">
          <span className="p404-brand-mark" />
          <span>ADRYANN FELIX</span>
          <span className="p404-brand-role">{t.notFound.brandRole}</span>
        </Link>

        <nav className="p404-nav">
          <Link to="/#work" data-cursor="link">{t.notFound.nav.work}</Link>
          <Link to="/#services" data-cursor="link">{t.notFound.nav.services}</Link>
          <Link to="/#process" data-cursor="link">{t.notFound.nav.process}</Link>
          <Link to="/#about" data-cursor="link">{t.notFound.nav.about}</Link>
        </nav>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="p404-cta"
          data-cursor="external"
        >
          {t.notFound.cta}
          <span className="p404-cta-arrow">↗</span>
        </a>
      </header>

      <main className="p404-main">
        <div className="err-side">
          <h1 className="err-code">404</h1>

          <div className="err-message">
            {t.notFound.errLines.map((line, i) => (
              <p className="err-line" key={i}>
                {line}
              </p>
            ))}
          </div>

          <Link to="/" className="err-home" data-cursor="link">
            {t.notFound.goHome}
            <span className="err-home-arrow">↗</span>
          </Link>
        </div>

        <div className="game-side">
          <Tetris />
        </div>
      </main>

      <footer className="p404-footer">
        <span className="footer-copy">© ADRYANN FELIX {new Date().getFullYear()}</span>
        <div className="footer-links">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="footer-link"
              data-cursor="external"
            >
              {s.label} <span className="fl-arr">↗</span>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
