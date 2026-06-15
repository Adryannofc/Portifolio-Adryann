import { useState, KeyboardEvent } from 'react';
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {error && <span className="admin-field-error">{error}</span>}
    </div>
  );
}

export function AdminProjetosForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  function addTag() {
    const tag = form.stackInput.trim();
    if (!tag || form.stack.includes(tag)) {
      set('stackInput', '');
      return;
    }
    setForm(f => ({ ...f, stack: [...f.stack, tag], stackInput: '' }));
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, stack: f.stack.filter(s => s !== tag) }));
  }

  function handleStackKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
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

  const progressLabel = `Progresso — ${form.progresso}%`;

  return (
    <div className="admin-content admin-form-wrap">
      {/* Breadcrumb */}
      <div className="admin-breadcrumb">
        <Link to="/admin/projetos">← Projetos</Link>
        <span>/</span>
        <span>Novo projeto</span>
      </div>

      <h1 className="admin-page-title">Novo projeto</h1>
      <p className="admin-page-subtitle">Cadastre um novo projeto de cliente</p>

      {/* ── Seção 1: Identificação ── */}
      <p className="admin-section-title">Identificação</p>

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
            style={{ minHeight: 88 }}
            value={form.desc}
            onChange={e => set('desc', e.target.value)}
            placeholder="Descreva o objetivo e escopo do projeto..."
          />
        </Field>
      </div>

      {/* ── Seção 2: Financeiro e Prazo ── */}
      <div className="admin-spacer" />
      <p className="admin-section-title">Financeiro e prazo</p>

      <div className="admin-field-row">
        <Field label="Valor (R$)" error={errors.valor}>
          <input
            className="admin-input"
            value={form.valor}
            onChange={e => set('valor', e.target.value)}
            placeholder="3500"
            inputMode="numeric"
          />
        </Field>
        <Field label={progressLabel}>
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

      {/* ── Seção 3: Stack ── */}
      <div className="admin-spacer" />
      <p className="admin-section-title">Stack tecnológico</p>

      <div className="admin-field-full">
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
      </div>

      {/* ── Ações ── */}
      <div className="admin-form-nav">
        <Link to="/admin/projetos" className="admin-btn">
          ← Cancelar
        </Link>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar projeto'}
        </button>
      </div>
    </div>
  );
}
