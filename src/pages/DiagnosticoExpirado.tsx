import { Link } from 'react-router-dom';

export function DiagnosticoExpirado() {
  return (
    <main data-theme="dark" className="diag-404-page">
      <div className="diag-404-inner">
        <div className="diag-expired-lock">⊘</div>
        <p className="diag-404-heading">Diagnóstico fora do período de validade.</p>
        <p className="diag-404-sub">
          Este documento não está mais disponível. Entre em contato para um novo diagnóstico atualizado.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <a
            href="https://wa.me/5587981209267"
            target="_blank"
            rel="noopener noreferrer"
            className="diag-cta-btn"
            style={{ display: 'inline-block', padding: '12px 28px', fontSize: 12 }}
          >
            SOLICITAR NOVO DIAGNÓSTICO →
          </a>
          <Link to="/" className="diag-404-back">
            ↑ Ver portfólio
          </Link>
        </div>
      </div>
    </main>
  );
}
