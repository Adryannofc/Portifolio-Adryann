import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiveClock } from '../hooks/useLiveClock';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { Overline, ULink } from './primitives';
import { useI18n } from '../contexts/I18nContext';

import logoImage from '../../public/images/Logo-adryann.svg';
type Theme = 'dark' | 'light';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  showIndex?: boolean;
  mono?: boolean;
}

export function Header({ theme, setTheme }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const clock = useLiveClock('America/Sao_Paulo');
  const progress = useScrollProgress();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const linkPrefix = isHome ? '' : '/';
  const [island, setIsland] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setIsland(window.scrollY > 80);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const darkSels = ['.hero', '.stack', '.contact', '.case-dark'];
    const check = () => {
      const y = (window.scrollY || 0) + 40;
      let isOverDark = false;
      darkSels.forEach((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const top = el.offsetTop;
        const bot = top + el.offsetHeight;
        if (y >= top && y < bot) isOverDark = true;
      });
      setOverDark(isOverDark);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Close mobile menu on route / hash change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks: [string, string][] = [
    ['#work', t.nav.work],
    ['#process', t.nav.process],
    ['#about', t.nav.about],
    ['#index', t.nav.index],
    ['#contact', t.nav.contact],
  ];

  return (
    <>
      <header
        className={`site-header ${island ? 'island' : ''} ${overDark ? 'over-dark' : ''}`}
        data-island={island}
        data-over-dark={overDark}
      >
        <div className="site-header-row">
          <a href={isHome ? '#top' : '/'} className="brand" data-cursor="link" aria-label="Home">
            <img src={logoImage} className="brand-logo" alt="" />
            <span className="brand-text">ADRYANN FELIX</span>
            <span className="overline brand-role">SOFTWARE ENGINEER</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <ULink href={`${linkPrefix}#work`}>{t.nav.work}</ULink>
            <ULink href={`${linkPrefix}#process`}>{t.nav.process}</ULink>
            <ULink href={`${linkPrefix}#about`}>{t.nav.about}</ULink>
            <ULink href={`${linkPrefix}#index`}>{t.nav.index}</ULink>
          </nav>

          <div className="site-meta">
            <span className="mono site-clock" aria-label="Local time in Foz do Iguaçu">
              <span className="site-clock-dot" /> FOZ · {clock}
            </span>
            <button
              className="theme-toggle"
              onClick={() => setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR')}
              aria-label={`Switch to ${locale === 'pt-BR' ? 'English' : 'Português'}`}
              data-cursor="link"
            >
              <span className="mono">{t.nav.langToggle}</span>
            </button>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              data-cursor="link"
            >
              <span className="mono">{theme === 'dark' ? '☾ DARK' : '☀ LIGHT'}</span>
            </button>
            <a className="contact-cta" href={`${linkPrefix}#contact`} data-cursor="link">
              <span>{t.nav.contact}</span>
              <span className="contact-dot" aria-hidden />
            </a>
            <button
              className="hamburger-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        id="mobile-menu"
        className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal
        aria-label="Navigation menu"
      >
        <nav className="mobile-menu-nav">
          {navLinks.map(([href, label]) => (
            <a key={href} href={`${linkPrefix}${href}`} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>
        <button
          className="mobile-menu-theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="mono">{theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}</span>
        </button>
        <div className="mobile-menu-status">
          <span className="amber-dot" aria-hidden /> {t.nav.available}
        </div>
      </div>

      <div className="site-progress-bar" aria-hidden>
        <div className="site-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}

interface SectionHeadProps {
  index: string;
  eyebrow: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  showIndex?: boolean;
  style?: CSSProperties;
}

export function SectionHead({
  index,
  eyebrow,
  title,
  right,
  showIndex = true,
  style,
}: SectionHeadProps) {
  return (
    <div className="section-head" style={style}>
      <div className="section-head-left">
        <Overline>
          {showIndex && <span className="sec-idx">{index}</span>}
          <span>{eyebrow}</span>
        </Overline>
        {title && <h2 className="h2 section-head-title">{title}</h2>}
      </div>
      {right && <div className="section-head-right">{right}</div>}
    </div>
  );
}
