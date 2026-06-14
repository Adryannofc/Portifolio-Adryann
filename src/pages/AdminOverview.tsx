import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Spinner } from '../components/Spinner';
import { StatCard } from '../components/admin/StatCard';

interface ViewRow {
  slug: string;
  type: string;
  opened_at: string;
}

interface DiagRow {
  id: string;
  slug: string;
  empresa: string;
  ativo: boolean;
  criado_em: string;
}

interface Stats {
  total: number;
  ativos: number;
  views: number;
  ctas: number;
  topSlug: string;
  topViews: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentes, setRecentes] = useState<DiagRow[]>([]);
  const [atividade, setAtividade] = useState<ViewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [diagResult, viewResult] = await Promise.all([
      supabase
        .from('diagnosticos')
        .select('id, slug, empresa, ativo, criado_em')
        .order('criado_em', { ascending: false }),
      supabase
        .from('diagnostico_views')
        .select('slug, type, opened_at')
        .order('opened_at', { ascending: false })
        .limit(50),
    ]);

    const diags = diagResult.data ?? [];
    const views = viewResult.data ?? [];

    const viewsBySlug: Record<string, number> = {};
    let totalViews = 0;
    let totalCtas = 0;

    views.forEach(v => {
      if (v.type === 'view') {
        totalViews++;
        viewsBySlug[v.slug] = (viewsBySlug[v.slug] ?? 0) + 1;
      }
      if (v.type === 'cta') totalCtas++;
    });

    const topEntry = Object.entries(viewsBySlug).sort((a, b) => b[1] - a[1])[0];

    setStats({
      total: diags.length,
      ativos: diags.filter(d => d.ativo).length,
      views: totalViews,
      ctas: totalCtas,
      topSlug: topEntry?.[0] ?? '—',
      topViews: topEntry?.[1] ?? 0,
    });
    setRecentes(diags.slice(0, 3));
    setAtividade(views.slice(0, 8));
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><Spinner /></div>;
  }

  const convRate = stats && stats.views > 0
    ? ((stats.ctas / stats.views) * 100).toFixed(1)
    : '0';

  return (
    <div className="admin-content">
      <div className="admin-stat-grid">
        <StatCard label="Total" value={stats?.total ?? 0} sub="diagnósticos criados" />
        <StatCard
          label="Ativos"
          value={stats?.ativos ?? 0}
          sub={`${stats ? stats.total - stats.ativos : 0} inativos`}
        />
        <StatCard label="Views totais" value={stats?.views ?? 0} />
        <StatCard label="CTAs totais" value={stats?.ctas ?? 0} accent />
        <StatCard
          label="Conversão"
          value={`${convRate}%`}
          sub="CTAs / views"
          accent={Number(convRate) > 0}
        />
        <StatCard
          label="Mais acessado"
          value={stats?.topSlug && stats.topSlug !== '—' ? stats.topSlug : '—'}
          sub={stats?.topViews ? `${stats.topViews} views` : undefined}
        />
      </div>

      <div className="admin-overview-grid">
        <div className="admin-overview-section">
          <div className="admin-overview-section-header">
            <h3 className="admin-overview-section-title">Atividade recente</h3>
          </div>
          {atividade.length === 0 ? (
            <div className="admin-empty">Nenhuma atividade registrada.</div>
          ) : (
            <ul className="admin-activity-list">
              {atividade.map((item, i) => (
                <li key={i} className="admin-activity-item">
                  <span className={`admin-activity-type admin-activity-type--${item.type}`}>
                    {item.type}
                  </span>
                  <span className="admin-activity-slug">{item.slug}</span>
                  <span className="admin-activity-time">
                    {new Date(item.opened_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-overview-section">
          <div className="admin-overview-section-header">
            <h3 className="admin-overview-section-title">Recentes</h3>
            <Link
              to="/admin/diagnosticos"
              style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--fg-mute)' }}
            >
              ver todos →
            </Link>
          </div>
          {recentes.length === 0 ? (
            <div className="admin-empty">
              Nenhum diagnóstico.{' '}
              <Link to="/admin/diagnostico/novo" style={{ color: 'var(--accent)' }}>Criar</Link>
            </div>
          ) : (
            <ul className="admin-recent-list">
              {recentes.map(d => (
                <li key={d.id} className="admin-recent-item">
                  <div style={{ overflow: 'hidden' }}>
                    <div className="admin-recent-empresa">{d.empresa}</div>
                    <div className="admin-recent-meta">
                      {new Date(d.criado_em).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <span className={`admin-badge ${d.ativo ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                    {d.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
