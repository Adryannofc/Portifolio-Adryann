import { useState, useMemo, useEffect, useRef } from 'react';

type Status = 'andamento' | 'concluido' | 'pausado' | 'planejamento';
type ViewMode = 'grid' | 'list';
type Filter = 'todos' | Status;

interface Projeto {
  id: number;
  nome: string;
  tipo: string;
  tipoClass: string;
  status: Status;
  statusLabel: string;
  progresso: number;
  valor: number;
  inicio: string;
  prazo: string;
  stack: string[];
  desc: string;
}

const PROJETOS: Projeto[] = [
  {
    id: 1, nome: 'Clínica Odontológica Silva',
    tipo: 'Site Institucional', tipoClass: '',
    status: 'andamento', statusLabel: 'Em andamento',
    progresso: 65, valor: 3500,
    inicio: '01/06/2026', prazo: '30/07/2026',
    stack: ['Next.js', 'Tailwind', 'Supabase'],
    desc: 'Site institucional com agendamento online, galeria de procedimentos e captação de leads via WhatsApp.',
  },
  {
    id: 2, nome: 'Conserto Mestre Foz',
    tipo: 'Landing Page', tipoClass: '',
    status: 'concluido', statusLabel: 'Concluído',
    progresso: 100, valor: 1200,
    inicio: '01/05/2026', prazo: '20/05/2026',
    stack: ['HTML', 'CSS', 'JavaScript'],
    desc: 'Landing page de alta conversão com formulário de orçamento instantâneo e botão WhatsApp fixo.',
  },
  {
    id: 3, nome: 'PetShop Foz',
    tipo: 'E-commerce', tipoClass: 'ecommerce',
    status: 'planejamento', statusLabel: 'Planejamento',
    progresso: 8, valor: 8000,
    inicio: '—', prazo: '30/09/2026',
    stack: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
    desc: 'Loja virtual completa com catálogo de produtos, carrinho, checkout Pix/cartão e painel admin.',
  },
  {
    id: 4, nome: 'Academia Força Total',
    tipo: 'Landing Page', tipoClass: '',
    status: 'pausado', statusLabel: 'Pausado',
    progresso: 40, valor: 1500,
    inicio: '15/04/2026', prazo: 'Em aberto',
    stack: ['React', 'Vite', 'Framer Motion'],
    desc: 'Landing page com seção de planos, depoimentos em carrossel e formulário de captação de leads.',
  },
];

const STATUS_BADGE: Record<Status, { cls: string; label: string }> = {
  andamento:   { cls: 'badge badge-ok', label: 'Em andamento' },
  concluido:   { cls: 'badge badge-ok', label: 'Concluído' },
  pausado:     { cls: 'badge badge-warn', label: 'Pausado' },
  planejamento:{ cls: 'badge', label: 'Planejamento' },
};

const PROGRESS_CLS: Record<Status, string> = {
  andamento: '', concluido: 'ok', pausado: 'warn', planejamento: '',
};

function fmtValor(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR');
}

function useCounter(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const dur = 700;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return value;
}

function ProjectCard({ p, listMode }: { p: Projeto; listMode: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);
  const badge = STATUS_BADGE[p.status];

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const target = bar.dataset.pct!;
    bar.style.width = '0%';
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => { bar.style.width = target + '%'; })
    );
    return () => cancelAnimationFrame(id);
  }, [p.progresso]);

  return (
    <div className={`proj-card status-${p.status}`}>
      <div className="proj-card-top">
        <span className={`proj-type-badge${p.tipoClass ? ' ' + p.tipoClass : ''}`}>{p.tipo}</span>
        <span className={badge.cls} style={p.status === 'concluido' ? { background: 'rgba(123,184,114,0.18)', color: '#7BB872' } : p.status === 'planejamento' ? { background: 'rgba(240,238,233,0.06)', color: 'rgba(240,238,233,0.5)' } : undefined}>
          <span className="badge-dot" />{badge.label}
        </span>
      </div>
      <div className="proj-card-body">
        <div className="proj-name">{p.nome}</div>
        <div className="proj-desc">{p.desc}</div>
        <div className="proj-progress-row">
          <div className="proj-progress-track">
            <div
              ref={barRef}
              className={`proj-progress-fill${PROGRESS_CLS[p.status] ? ' ' + PROGRESS_CLS[p.status] : ''}`}
              data-pct={p.progresso}
              style={{ width: 0 }}
            />
          </div>
          <span className="proj-progress-pct">{p.progresso}%</span>
        </div>
        <div className="proj-stack">
          {p.stack.map(s => <span key={s} className="proj-tag">{s}</span>)}
        </div>
      </div>
      <div className="proj-card-foot">
        <div className="proj-meta">
          <div className="proj-meta-row">
            <span>Início</span>
            <span className="proj-meta-val">{p.inicio}</span>
          </div>
          <div className="proj-meta-row">
            <span>Prazo&nbsp;</span>
            <span className="proj-meta-val">{p.prazo}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: listMode ? 'column' : 'column', alignItems: listMode ? 'flex-start' : 'flex-end', gap: 8 }}>
          <span className="proj-value">{fmtValor(p.valor)}</span>
          <div className="proj-actions">
            <button className="proj-btn primary">Abrir</button>
            <button className="proj-btn">Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProjetos() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const counts = useMemo(() => ({
    todos: PROJETOS.length,
    andamento: PROJETOS.filter(p => p.status === 'andamento').length,
    concluido: PROJETOS.filter(p => p.status === 'concluido').length,
    pausado: PROJETOS.filter(p => p.status === 'pausado').length,
    planejamento: PROJETOS.filter(p => p.status === 'planejamento').length,
  }), []);

  const receita = useMemo(() => PROJETOS.reduce((s, p) => s + p.valor, 0), []);

  const displayed = useMemo(() =>
    filter === 'todos' ? PROJETOS : PROJETOS.filter(p => p.status === filter),
    [filter]
  );

  const cTotal    = useCounter(counts.todos, true);
  const cAndamento= useCounter(counts.andamento, true);
  const cConcluido= useCounter(counts.concluido, true);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'todos',       label: 'Todos' },
    { key: 'andamento',   label: 'Em andamento' },
    { key: 'concluido',   label: 'Concluído' },
    { key: 'pausado',     label: 'Pausado' },
    { key: 'planejamento',label: 'Planejamento' },
  ];

  return (
    <div className="admin-content">
      <div className="proj-view-head">
        <div>
          <h1 className="proj-view-title">Projetos</h1>
          <div className="proj-view-sub">Gerencie todos os projetos de clientes</div>
        </div>
        <div className="proj-view-actions">
          <div className="view-toggle">
            <button
              className={`vt-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid"
            >⊞</button>
            <button
              className={`vt-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Lista"
            >≡</button>
          </div>
          <button className="btn-primary">+ Novo projeto</button>
        </div>
      </div>

      {/* Stats */}
      <div className="proj-stats">
        <div className="stat-card">
          <div className="stat-label">Total de Projetos</div>
          <div className="stat-value">{cTotal}</div>
          <div className="stat-sub">todos os clientes</div>
        </div>
        <div className="stat-card ok-card">
          <div className="stat-label">Em Andamento</div>
          <div className="stat-value c-ok">{cAndamento}</div>
          <div className="stat-sub">em desenvolvimento</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Concluídos</div>
          <div className="stat-value">{cConcluido}</div>
          <div className="stat-sub">entregues ao cliente</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Receita Total</div>
          <div className="stat-value c-amber" style={{ fontSize: 22, marginTop: 2 }}>
            {fmtValor(receita)}
          </div>
          <div className="stat-sub">valor contratado</div>
        </div>
      </div>

      {/* Filter row */}
      <div className="proj-filter-row">
        <div className="filter-tabs">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`filter-tab${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
              <span className="filter-count">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className={`proj-grid${viewMode === 'list' ? ' list-mode' : ''}`}>
        {displayed.length === 0 ? (
          <div className="proj-empty">Nenhum projeto encontrado para este filtro</div>
        ) : (
          displayed.map(p => (
            <ProjectCard key={p.id} p={p} listMode={viewMode === 'list'} />
          ))
        )}
      </div>
    </div>
  );
}
