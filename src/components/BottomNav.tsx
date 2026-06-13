import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DiagSheet } from './DiagSheet';

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DiagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isDiag = location.pathname.startsWith('/diagnostico');

  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    setSavedSlug(localStorage.getItem('last_diagnostico_slug'));
  }, [location.pathname]);

  function handleDiagClick() {
    const slug = savedSlug ?? localStorage.getItem('last_diagnostico_slug');
    if (slug) {
      navigate(`/diagnostico/${slug}`);
    } else {
      setShowSheet(true);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;
    setShowSheet(false);
    setCode('');
    navigate(`/diagnostico/${trimmed}`);
  }

  const hasDiag = !isDiag && !!savedSlug;

  return (
    <>
      <DiagSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        code={code}
        setCode={setCode}
        onSubmit={handleSubmit}
      />

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <div className="bottom-nav-inner">
          <a
            href="https://wa.me/558781209267"
            target="_blank"
            rel="noopener noreferrer"
            className="bottom-nav-item"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
            <span className="bottom-nav-label">Chat</span>
          </a>

          <a
            href="https://github.com/Adryannofc"
            target="_blank"
            rel="noopener noreferrer"
            className="bottom-nav-item"
            aria-label="GitHub"
          >
            <GitHubIcon />
            <span className="bottom-nav-label">GitHub</span>
          </a>

          <a href="/" className="bottom-nav-fab" aria-label="Home">
            <span className={`fab-circle${isHome ? ' is-active' : ''}`}>
              <HomeIcon />
            </span>
          </a>

          <button
            type="button"
            onClick={handleDiagClick}
            className={`bottom-nav-item${isDiag ? ' is-active' : ''}`}
            aria-label="Relatório"
          >
            <span className="diag-btn-wrap">
              <DiagIcon />
              {hasDiag && <span className="diag-dot" />}
            </span>
            <span className="bottom-nav-label">Diag</span>
          </button>

          <a
            href="https://www.linkedin.com/in/adryann-felix-7a3b4925b/"
            target="_blank"
            rel="noopener noreferrer"
            className="bottom-nav-item"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
            <span className="bottom-nav-label">LinkedIn</span>
          </a>
        </div>
      </nav>
    </>
  );
}
