import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Status = 'andamento' | 'concluido' | 'pausado' | 'planejamento';

const TIPOS = [
  'Site Institucional',
  'Landing Page',
  'E-commerce',
  'Sistema Web',
  'Aplicativo',
];

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'andamento',    label: 'Em andamento' },
  { value: 'pausado',      label: 'Pausado' },
  { value: 'concluido',    label: 'Concluído' },
];

const STATUS_BADGE: Record<Status, { cls: string; label: string; style?: React.CSSProperties }> = {
  andamento:    { cls: 'badge badge-ok', label: 'Em andamento' },
  concluido:    { cls: 'badge badge-ok', label: 'Concluído', style: { background: 'rgba(123,184,114,0.18)', color: '#7BB872' } },
  pausado:      { cls: 'badge badge-warn', label: 'Pausado' },
  planejamento: { cls: 'badge', label: 'Planejamento', style: { background: 'rgba(240,238,233,0.06)', color: 'rgba(240,238,233,0.45)' } },
};

interface FormState {
  nome: string;
  tipo: string;
  status: Status;
  desc: string;
  valor: string;
  inicio: string;
  prazo: string;
  progresso: number;
  stack: string[];
  stackInput: string;
}

interface Errors {
  nome?: string;
  desc?: string;
  valor?: string;
}

const EMPTY: FormState = {
  nome: '',
  tipo: 'Site Institucional',
  status: 'planejamento',
  desc: '',
  valor: '',
  inicio: '',
  prazo: '',
  progresso: 0,
  stack: [],
  stackInput: '',
};

/* ── Field wrapper ── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {error && <span className="admin-field-error">{error}</span>}
    </div>
  );
}

/* ── Live preview mini card ── */
function PreviewCard({ form }: { form: FormState }) {
  const badge = STATUS_BADGE[form.status];
  const hasName  = !!form.nome.trim();
  const hasDesc  = !!form.desc.trim();
  const hasStack = form.stack.length > 0;
  const valorNum = parseFloat(form.valor.replace(',', '.')) || 0;

  function fmtDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  const inicioPt = fmtDate(form.inicio);
  const prazoPt  = fmtDate(form.prazo);

  return (
    <div className={`pf-preview-card status-${form.status}`}>
      <div className="pf-preview-top">
        <span className="proj-type-badge">{form.tipo}</span>
        <span className={badge.cls} style={badge.style}>
          <span className="badge-dot" />{badge.label}
        </span>
      </div>

      <div className="pf-preview-body">
        <div className={`pf-preview-name${!hasName ? ' pf-ph' : ''}`}>
          {hasName ? form.nome : 'Nome do projeto...'}
        </div>
        <div className={`pf-preview-desc${!hasDesc ? ' pf-ph' : ''}`}>
          {hasDesc ? form.desc : 'Descrição aparecerá aqui...'}
        </div>

        <div className="proj-progress-track" style={{ marginBottom: 8 }}>
          <div
            className="proj-progress-fill"
            style={{ width: `${form.progresso}%`, transition: 'width 300ms ease' }}
          />
        </div>

        <div className="proj-stack">
          {hasStack
            ? form.stack.map(s => <span key={s} className="proj-tag">{s}</span>)
            : <span className="pf-ph" style={{ fontFamily: 'var(--ff-mono)', fontSize: 9 }}>stack aparecerá aqui...</span>}
        </div>
      </div>

      <div className="pf-preview-foot">
        <span className="pf-preview-dates">
          {inicioPt || prazoPt
            ? [inicioPt && `Início ${inicioPt}`, prazoPt && `Prazo ${prazoPt}`].filter(Boolean).join('  ·  ')
            : 'Datas não definidas'}
        </span>
        <span className="proj-value" style={{ fontSize: 10 }}>
          {valorNum > 0 ? 'R$ ' + valorNum.toLocaleString('pt-BR') : 'R 0'}
        </span>
      </div>
    </div>
  );
}

/* ── Checklist ── */
const CHECK_ITEMS: { key: string; label: string }[] = [
  { key: 'nome',  label: 'Nome do projeto' },
  { key: 'desc',  label: 'Descrição' },
  { key: 'valor', label: 'Valor definido' },
  { key: 'prazo', label: 'Prazo de entrega' },
  { key: 'stack', label: 'Stack tecnológico' },
];

function isDone(key: string, form: FormState): boolean {
  switch (key) {
    case 'nome':  return !!form.nome.trim();
    case 'desc':  return !!form.desc.trim();
    case 'valor': return !!form.valor.trim();
    case 'prazo': return !!form.prazo;
    case 'stack': return form.stack.length > 0;
    default:      return false;
  }
}

/* ── Main component ── */
export function AdminProjetosForm() {
  const navigate = useNavigate();
  const [form, setForm]   = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  function addTag() {
    const tag = form.stackInput.trim();
    if (!tag || form.stack.includes(tag)) { set('stackInput', ''); return; }
    setForm(f => ({ ...f, stack: [...f.stack, tag], stackInput: '' }));
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, stack: f.stack.filter(s => s !== tag) }));
  }

  function handleStackKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !form.stackInput && form.stack.length > 0) {
      removeTag(form.stack[form.stack.length - 1]);
    }
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.desc.trim()) errs.desc = 'Descrição é obrigatória';
    if (form.valor && isNaN(Number(form.valor.replace(',', '.')))) {
      errs.valor = 'Valor inválido — use apenas números';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    // TODO: Supabase — inserir em tabela `projetos`
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/admin/projetos', { state: { success: true, nome: form.nome } });
  }

  return (
    <div className="admin-content">
      <div className="admin-breadcrumb">
        <Link to="/admin/projetos">← Projetos</Link>
        <span>/</span>
        <span>Novo projeto</span>
      </div>

      <h1 className="admin-page-title">Novo projeto</h1>
      <p className="admin-page-subtitle" style={{ marginBottom: 24 }}>Cadastre um novo projeto de cliente</p>

      <div className="pf-layout">

        {/* ───── Form column ───── */}
        <div className="pf-main">

          {/* Seção 1 — Identificação */}
          <section className="pf-section">
            <p className="pf-section-title">Identificação</p>

            <div className="admin-field-full">
              <Field label="Nome do projeto *" error={errors.nome}>
                <input
                  className="admin-input"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Ex: Clínica Odontológica Silva"
                  autoFocus
                />
              </Field>
            </div>

            <div className="admin-field-row">
              <Field label="Tipo de projeto">
                <select
                  className="admin-select admin-input"
                  value={form.tipo}
                  onChange={e => set('tipo', e.target.value)}
                >
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Status inicial">
                <select
                  className="admin-select admin-input"
                  value={form.status}
                  onChange={e => set('status', e.target.value as Status)}
                >
                  {STATUS_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="admin-field-full">
              <Field label="Descrição *" error={errors.desc}>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: 96 }}
                  value={form.desc}
                  onChange={e => set('desc', e.target.value)}
                  placeholder="Descreva o objetivo e escopo do projeto..."
                />
              </Field>
            </div>
          </section>

          {/* Seção 2 — Financeiro e Prazo */}
          <section className="pf-section">
            <p className="pf-section-title">Financeiro e prazo</p>

            <div className="admin-field-row">
              <Field label="Valor (R$)" error={errors.valor}>
                <div className="pf-prefix-wrap">
                  <span className="pf-prefix">R$</span>
                  <input
                    className="admin-input pf-prefix-input"
                    value={form.valor}
                    onChange={e => set('valor', e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>
              </Field>
              <Field label={`Progresso — ${form.progresso}%`}>
                <input
                  type="range"
                  className="admin-range"
                  min="0"
                  max="100"
                  value={form.progresso}
                  onChange={e => set('progresso', Number(e.target.value))}
                />
              </Field>
            </div>

            <div className="admin-field-row">
              <Field label="Data de início">
                <input
                  type="date"
                  className="admin-input"
                  value={form.inicio}
                  onChange={e => set('inicio', e.target.value)}
                />
              </Field>
              <Field label="Prazo de entrega">
                <input
                  type="date"
                  className="admin-input"
                  value={form.prazo}
                  onChange={e => set('prazo', e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Seção 3 — Stack */}
          <section className="pf-section">
            <p className="pf-section-title">Stack tecnológico</p>

            <div className="admin-field">
              <span className="admin-label">Tecnologias</span>
              <div className="stack-tag-input">
                {form.stack.map(tag => (
                  <span key={tag} className="stack-chip">
                    {tag}
                    <button
                      type="button"
                      className="stack-chip-rm"
                      onClick={() => removeTag(tag)}
                      title="Remover"
                    >×</button>
                  </span>
                ))}
                <input
                  className="stack-tag-field"
                  value={form.stackInput}
                  onChange={e => set('stackInput', e.target.value)}
                  onKeyDown={handleStackKeyDown}
                  onBlur={addTag}
                  placeholder={form.stack.length === 0 ? 'Next.js, Tailwind, Supabase... (Enter para adicionar)' : ''}
                />
              </div>
              <span className="admin-field-hint">
                Pressione Enter ou vírgula para adicionar. Backspace remove o último.
              </span>
            </div>
          </section>

          {/* Ações */}
          <div className="admin-form-nav">
            <Link to="/admin/projetos" className="admin-btn">← Cancelar</Link>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar projeto'}
            </button>
          </div>
        </div>

        {/* ───── Sidebar ───── */}
        <aside className="pf-sidebar">
          <div className="pf-sidebar-block">
            <p className="pf-sidebar-label">Pré-visualização</p>
            <PreviewCard form={form} />
          </div>

          <div className="pf-sidebar-block">
            <p className="pf-sidebar-label">Checklist</p>
            <ul className="pf-checklist">
              {CHECK_ITEMS.map(item => {
                const done = isDone(item.key, form);
                return (
                  <li key={item.key} className={`pf-check-item${done ? ' done' : ''}`}>
                    <span className="pf-check-dot">{done ? '●' : '○'}</span>
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
