import { Link } from 'react-router-dom';

export function DiagnosticoNotFound() {
  return (
    <main data-theme="dark" className="diag-404-page">
      <div className="diag-404-inner">
        <div className="diag-404-n mono">404</div>
        <p className="diag-404-heading">Diagnóstico não encontrado.</p>
        <p className="diag-404-sub">
          Este link pode ter expirado ou o slug está incorreto.
        </p>
        <Link to="/" className="diag-404-back">
          ↑ Voltar ao portfólio
        </Link>
      </div>
    </main>
  );
}
