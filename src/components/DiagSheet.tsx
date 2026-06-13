import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  code: string;
  setCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DiagSheet({ open, onClose, code, setCode, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="diag-sheet-overlay" onClick={onClose} />
      <div className="diag-sheet">
        <p className="diag-sheet-title">Acessar relatório</p>
        <p className="diag-sheet-sub">
          Digite o código do seu diagnóstico — é o texto no final do link que você recebeu.
        </p>
        <form onSubmit={onSubmit} className="diag-sheet-form">
          <input
            ref={inputRef}
            className="diag-sheet-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="ex: nome-da-empresa"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="diag-sheet-btn">Acessar →</button>
        </form>
        <button type="button" className="diag-sheet-close" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </>
  );
}
