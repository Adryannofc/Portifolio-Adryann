import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';

interface DiagRow {
  id: string;
  slug: string;
  empresa: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  totalViews: number;
  totalCtas: number;
  ultimaAbertura: string | null;
}

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [rows, setRows] = useState<DiagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [diagResult, viewResult] = await Promise.all([
      supabase
        .from('diagnosticos')
        .select('id, slug, empresa, ativo, criado_em, atualizado_em')
        .order('criado_em', { ascending: false }),
      supabase
        .from('diagnostico_views')
        .select('slug, type, opened_at'),
    ]);

    if (diagResult.error) {
      setError(diagResult.error.message);
      setLoading(false);
      return;
    }

    const stats: Record<string, { views: number; ctas: number; last: string | null }> = {};
    viewResult.data?.forEach(v => {
      if (!stats[v.slug]) stats[v.slug] = { views: 0, ctas: 0, last: null };
      if (v.type === 'view') stats[v.slug].views++;
      if (v.type === 'cta')  stats[v.slug].ctas++;
      if (!stats[v.slug].last || v.opened_at > stats[v.slug].last!) stats[v.slug].last = v.opened_at;
    });

    const enriched: DiagRow[] = (diagResult.data ?? []).map(d => ({
      ...d,
      totalViews:     stats[d.slug]?.views ?? 0,
      totalCtas:      stats[d.slug]?.ctas  ?? 0,
      ultimaAbertura: stats[d.slug]?.last  ?? null,
    }));

    setRows(enriched);
    setLoading(false);
  }

  async function toggleAtivo(id: string, current: boolean) {
    const { error } = await supabase
      .from('diagnosticos')
      .update({ ativo: !current, atualizado_em: new Date().toISOString() })
      .eq('id', id);

    if (error) return setError(error.message);
    setRows(r => r.map(row => row.id === id ? { ...row, ativo: !current } : row));
  }

  async function deleteDiag(id: string, empresa: string) {
    if (!confirm(`Excluir diagnóstico de "${empresa}"? Essa ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from('diagnosticos').delete().eq('id', id);
    if (error) return setError(error.message);
    setRows(r => r.filter(row => row.id !== id));
  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <Link to="/admin/dashboard" className="admin-header-brand">DIAG / CMS</Link>
        <div className="admin-header-right">
          <span className="admin-user-email">{user?.email}</span>
          <button className="admin-btn admin-btn-sm" onClick={() => signOut()}>Sair</button>
        </div>
      </header>

      <div className="admin-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 className="admin-page-title">Diagnósticos</h1>
            <p className="admin-page-subtitle">Gerencie diagnósticos de presença digital</p>
          </div>
          <Link to="/admin/diagnostico/novo" className="admin-btn admin-btn-primary">
            + Novo diagnóstico
          </Link>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <div className="admin-empty">
            Nenhum diagnóstico criado ainda.{' '}
            <Link to="/admin/diagnostico/novo" style={{ color: 'var(--accent)' }}>Criar o primeiro</Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Views</th>
                  <th style={{ textAlign: 'center' }}>CTAs</th>
                  <th>Última abertura</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.empresa}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                        {row.slug}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${row.ativo ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                        {row.ativo ? '● Ativo' : '○ Inativo'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, textAlign: 'center', color: row.totalViews > 0 ? 'var(--fg)' : 'var(--fg-muted)' }}>
                      {row.totalViews > 0 ? row.totalViews : '—'}
                    </td>
                    <td style={{ fontSize: 13, textAlign: 'center', color: row.totalCtas > 0 ? 'var(--accent)' : 'var(--fg-muted)' }}>
                      {row.totalCtas > 0 ? row.totalCtas : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                      {row.ultimaAbertura
                        ? new Date(row.ultimaAbertura).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                      {new Date(row.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <a
                          href={`/diagnostico/${row.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-btn admin-btn-sm"
                        >
                          Ver
                        </a>
                        <Link
                          to={`/admin/diagnostico/${row.id}/editar`}
                          className="admin-btn admin-btn-sm"
                        >
                          Editar
                        </Link>
                        <button
                          className="admin-btn admin-btn-sm"
                          onClick={() => toggleAtivo(row.id, row.ativo)}
                        >
                          {row.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => deleteDiag(row.id, row.empresa)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
