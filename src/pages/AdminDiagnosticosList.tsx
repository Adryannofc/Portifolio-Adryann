import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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

type SortKey = 'empresa' | 'status' | 'views' | 'criado';
type SortDir = 1 | -1;

export function AdminDiagnosticosList() {
  const [rows, setRows]       = useState<DiagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [query, setQuery]     = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('criado');
  const [sortDir, setSortDir] = useState<SortDir>(-1);

  useEffect(() => { fetchAll(); }, []);

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

    if (diagResult.error) { setError(diagResult.error.message); setLoading(false); return; }

    const stats: Record<string,{ views:number; ctas:number; last:string|null }> = {};
    viewResult.data?.forEach(v => {
      if(!stats[v.slug]) stats[v.slug]={views:0,ctas:0,last:null};
      if(v.type==='view') stats[v.slug].views++;
      if(v.type==='cta')  stats[v.slug].ctas++;
      if(!stats[v.slug].last || v.opened_at>stats[v.slug].last!) stats[v.slug].last=v.opened_at;
    });

    setRows((diagResult.data ?? []).map(d => ({
      ...d,
      totalViews:     stats[d.slug]?.views ?? 0,
      totalCtas:      stats[d.slug]?.ctas  ?? 0,
      ultimaAbertura: stats[d.slug]?.last  ?? null,
    })));
    setLoading(false);
  }

  async function toggleAtivo(id: string, current: boolean) {
    const { error } = await supabase
      .from('diagnosticos')
      .update({ ativo: !current, atualizado_em: new Date().toISOString() })
      .eq('id', id);
    if(error) return setError(error.message);
    setRows(r => r.map(row => row.id===id ? {...row, ativo:!current} : row));
  }

  async function deleteDiag(id: string, empresa: string) {
    if(!confirm(`Excluir diagnóstico de "${empresa}"? Essa ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from('diagnosticos').delete().eq('id', id);
    if(error) return setError(error.message);
    setRows(r => r.filter(row => row.id!==id));
  }

  function handleSort(key: SortKey) {
    if(sortKey===key) setSortDir(d => (d===1?-1:1) as SortDir);
    else { setSortKey(key); setSortDir(1); }
  }

  const displayed = useMemo(() => {
    const filtered = query
      ? rows.filter(r => r.empresa.toLowerCase().includes(query.toLowerCase()))
      : rows;

    return [...filtered].sort((a,b) => {
      let va: string|number, vb: string|number;
      switch(sortKey){
        case 'empresa': va=a.empresa; vb=b.empresa; break;
        case 'status':  va=a.ativo?'ativo':'inativo'; vb=b.ativo?'ativo':'inativo'; break;
        case 'views':   va=a.totalViews; vb=b.totalViews; break;
        case 'criado':  va=a.criado_em;  vb=b.criado_em;  break;
        default: return 0;
      }
      if(typeof va==='number' && typeof vb==='number') return (va-vb)*sortDir;
      return String(va).localeCompare(String(vb))*sortDir;
    });
  }, [rows, query, sortKey, sortDir]);

  const sortIcon = (key: SortKey) =>
    sortKey===key ? (sortDir===1?' ↑':' ↓') : '';

  return (
    <div className="admin-content">
      <div className="diag-head">
        <div>
          <h1 className="diag-title">Diagnósticos</h1>
          <div className="diag-sub">Gerencie diagnósticos de presença digital</div>
        </div>
        <Link to="/admin/diagnostico/novo" className="btn-primary">
          + Novo diagnóstico
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? <Spinner /> : (
        <div className="table-wrap">
          <div className="table-toolbar">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Buscar empresa..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <span className="table-meta">
              {displayed.length} diagnóstico{displayed.length!==1?'s':''}
            </span>
          </div>

          {displayed.length === 0 ? (
            <div className="admin-empty">
              {query ? 'Nenhum resultado.' : (
                <>Nenhum diagnóstico criado.{' '}
                  <Link to="/admin/diagnostico/novo" style={{color:'var(--amber)'}}>Criar o primeiro</Link>
                </>
              )}
            </div>
          ) : (
            <table className="diag-tbl">
              <thead>
                <tr>
                  <th onClick={()=>handleSort('empresa')} className={sortKey==='empresa'?'sorted':''}>
                    Empresa{sortIcon('empresa')}
                  </th>
                  <th>Slug</th>
                  <th onClick={()=>handleSort('status')} className={sortKey==='status'?'sorted':''}>
                    Status{sortIcon('status')}
                  </th>
                  <th onClick={()=>handleSort('views')} className={sortKey==='views'?'sorted':''}>
                    Views{sortIcon('views')}
                  </th>
                  <th>CTAs</th>
                  <th>Última Abertura</th>
                  <th onClick={()=>handleSort('criado')} className={sortKey==='criado'?'sorted':''}>
                    Criado em{sortIcon('criado')}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(row => (
                  <tr key={row.id}>
                    <td><span className="td-name">{row.empresa}</span></td>
                    <td><span className="td-slug">{row.slug}</span></td>
                    <td>
                      <div className={`badge ${row.ativo?'badge-ok':'badge-warn'}`}>
                        <span className="badge-dot" />{row.ativo?'Ativo':'Inativo'}
                      </div>
                    </td>
                    <td>
                      <span className={row.totalViews>0?'':'td-mute'}>
                        {row.totalViews>0?row.totalViews:'—'}
                      </span>
                    </td>
                    <td>
                      <span className={row.totalCtas>0?'':'td-mute'} style={row.totalCtas>0?{color:'var(--amber)'}:undefined}>
                        {row.totalCtas>0?row.totalCtas:'—'}
                      </span>
                    </td>
                    <td>
                      <span className="td-date">
                        {row.ultimaAbertura
                          ? new Date(row.ultimaAbertura).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
                          : <span className="td-mute">—</span>}
                      </span>
                    </td>
                    <td><span className="td-date">{new Date(row.criado_em).toLocaleDateString('pt-BR')}</span></td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <a
                          href={`/diagnostico/${row.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="act-btn primary"
                        >
                          Ver
                        </a>
                        <Link to={`/admin/diagnostico/${row.id}/editar`} className="act-btn">
                          Editar
                        </Link>
                        <button
                          className={`act-btn ${row.ativo?'danger':'primary'}`}
                          onClick={() => toggleAtivo(row.id, row.ativo)}
                        >
                          {row.ativo?'Desativar':'Ativar'}
                        </button>
                        <button
                          className="act-btn danger"
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
          )}
        </div>
      )}
    </div>
  );
}
