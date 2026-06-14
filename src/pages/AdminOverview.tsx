import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Spinner } from '../components/Spinner';

type Period = 'hoje' | '7d' | '30d' | 'total';

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

// ── Counter animation ─────────────────────────────────────────
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
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return value;
}

// ── Chart data builder ────────────────────────────────────────
function buildChartData(views: ViewRow[], period: Period) {
  const now = new Date();
  const dnames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  if (period === 'hoje') {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2,'0') + 'h');
    const data = new Array(24).fill(0);
    const midnight = new Date(now); midnight.setHours(0,0,0,0);
    views.filter(v => v.type === 'view' && new Date(v.opened_at) >= midnight)
         .forEach(v => { data[new Date(v.opened_at).getHours()]++; });
    return { labels, data };
  }

  const n = period === '7d' ? 7 : period === '30d' ? 30 : 60;
  const labels: string[] = [];
  const data = new Array(n).fill(0);
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - (n - 1)); cutoff.setHours(0,0,0,0);

  for (let i = 0; i < n; i++) {
    const d = new Date(cutoff); d.setDate(d.getDate() + i);
    labels.push(period === '7d' ? dnames[d.getDay()] : `${d.getDate()}/${d.getMonth()+1}`);
  }

  views.filter(v => v.type === 'view' && new Date(v.opened_at) >= cutoff).forEach(v => {
    const vd = new Date(v.opened_at); vd.setHours(0,0,0,0);
    const diff = Math.round((vd.getTime() - cutoff.getTime()) / 86400000);
    if (diff >= 0 && diff < n) data[diff]++;
  });

  return { labels, data };
}

// ── Chart canvas ──────────────────────────────────────────────
interface ChartProps { views: ViewRow[]; period: Period }

function ChartCanvas({ views, period }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(-1);
  const dataRef = useRef<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const periodRef = useRef(period);

  const draw = useCallback((p: Period) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.offsetWidth === 0) return;
    const { labels, data } = buildChartData(views, p);
    dataRef.current = { labels, data };
    periodRef.current = p;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 200;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const pL=36, pR=16, pT=14, pB=32;
    const maxVal = Math.max(...data, 4);
    const gW=W-pL-pR, gH=H-pT-pB;
    const gx = (i: number) => pL + gW * i / Math.max(data.length-1,1);
    const gy = (v: number) => pT + gH * (1 - v/maxVal);

    // Grid
    ctx.strokeStyle='rgba(240,238,233,0.05)'; ctx.lineWidth=1;
    [0,0.25,0.5,0.75,1].forEach(t => {
      const y = Math.round(pT+gH*t);
      ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(W-pR,y); ctx.stroke();
      ctx.fillStyle='rgba(240,238,233,0.22)';
      ctx.font=`9px 'JetBrains Mono',monospace`; ctx.textAlign='right';
      ctx.fillText(String(Math.round(maxVal*(1-t))), pL-5, y+3);
    });
    ctx.fillStyle='rgba(240,238,233,0.22)'; ctx.textAlign='center';
    const step=Math.ceil(data.length/8);
    for(let i=0;i<data.length;i+=step) ctx.fillText(labels[i], gx(i), H-6);

    // Dashed baseline
    ctx.beginPath(); ctx.setLineDash([4,4]);
    ctx.strokeStyle='rgba(240,238,233,0.12)'; ctx.lineWidth=1.5;
    ctx.moveTo(pL,gy(0)); ctx.lineTo(W-pR,gy(0)); ctx.stroke(); ctx.setLineDash([]);

    // Gradient fill
    const grad=ctx.createLinearGradient(0,pT,0,H-pB);
    grad.addColorStop(0,'rgba(242,135,5,0.18)'); grad.addColorStop(1,'rgba(242,135,5,0)');
    ctx.beginPath(); ctx.moveTo(gx(0),gy(data[0]));
    for(let i=1;i<data.length;i++){
      const mx=(gx(i-1)+gx(i))/2;
      ctx.bezierCurveTo(mx,gy(data[i-1]),mx,gy(data[i]),gx(i),gy(data[i]));
    }
    ctx.lineTo(gx(data.length-1),H-pB); ctx.lineTo(gx(0),H-pB); ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();

    // Line
    ctx.beginPath(); ctx.moveTo(gx(0),gy(data[0]));
    for(let i=1;i<data.length;i++){
      const mx=(gx(i-1)+gx(i))/2;
      ctx.bezierCurveTo(mx,gy(data[i-1]),mx,gy(data[i]),gx(i),gy(data[i]));
    }
    ctx.strokeStyle='#F28705'; ctx.lineWidth=2; ctx.stroke();

    // Hover
    const hi=hoverRef.current;
    if(hi>=0 && hi<data.length){
      const hx=gx(hi), hy=gy(data[hi]);
      ctx.beginPath(); ctx.setLineDash([3,3]);
      ctx.strokeStyle='rgba(242,135,5,0.25)'; ctx.lineWidth=1;
      ctx.moveTo(hx,pT); ctx.lineTo(hx,H-pB); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(hx,hy,4,0,Math.PI*2);
      ctx.fillStyle='#F28705'; ctx.fill();
      ctx.beginPath(); ctx.arc(hx,hy,7,0,Math.PI*2);
      ctx.fillStyle='rgba(242,135,5,0.2)'; ctx.fill();
    }

    // Watermark
    if(!data.some(v=>v>0)){
      ctx.font=`500 10px 'JetBrains Mono',monospace`;
      ctx.fillStyle='rgba(240,238,233,0.08)'; ctx.textAlign='center';
      ctx.fillText('SEM DADOS · AGUARDANDO PRIMEIROS ACESSOS', W/2, H/2+4);
    }

    (canvas as any)._gx = gx;
  }, [views]);

  useEffect(() => {
    let raf1: number, raf2: number;
    raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => draw(period)); });
    const onResize = () => draw(periodRef.current);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf1); cancelAnimationFrame(raf2);
      window.removeEventListener('resize', onResize);
    };
  }, [draw]);

  useEffect(() => { draw(period); }, [period, draw]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;
    if(!canvas || !tooltip) return;
    const { labels, data } = dataRef.current;
    const gx = (canvas as any)._gx;
    if(!gx) return;
    const mx = e.clientX - canvas.getBoundingClientRect().left;
    let best=0, minD=Infinity;
    for(let i=0;i<data.length;i++){ const d=Math.abs(mx-gx(i)); if(d<minD){minD=d;best=i;} }
    hoverRef.current=best;
    draw(periodRef.current);
    tooltip.querySelector('.tt-day')!.textContent=labels[best]||'—';
    tooltip.querySelector('.tt-val')!.textContent=String(data[best]);
    tooltip.style.left=(e.clientX+14)+'px';
    tooltip.style.top=(e.clientY-50)+'px';
    tooltip.classList.add('show');
  };

  const onMouseLeave = () => {
    hoverRef.current=-1;
    draw(periodRef.current);
    tooltipRef.current?.classList.remove('show');
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display:'block', width:'100%', height:200, cursor:'crosshair' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      <div className="chart-tooltip" ref={tooltipRef}>
        <div className="tt-day">—</div>
        <div className="tt-val">0</div>
        <div className="tt-label">views</div>
      </div>
    </>
  );
}

// ── Donut chart ───────────────────────────────────────────────
function DonutChart({ pct }: { pct: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if(!c) return;
    const ctx = c.getContext('2d')!;
    const cx=36, cy=36, r=28, lw=6;
    ctx.clearRect(0,0,72,72);
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(240,238,233,0.07)'; ctx.lineWidth=lw; ctx.stroke();
    if(pct>0){
      ctx.beginPath();
      ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct/100);
      ctx.strokeStyle='#F28705'; ctx.lineWidth=lw; ctx.stroke();
    }
  }, [pct]);
  return <canvas ref={ref} width={72} height={72} />;
}

// ── Main component ────────────────────────────────────────────
export function AdminOverview() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [recentes, setRecentes] = useState<DiagRow[]>([]);
  const [diags, setDiags]       = useState<DiagRow[]>([]);
  const [views, setViews]       = useState<ViewRow[]>([]);
  const [period, setPeriod]     = useState<Period>('hoje');
  const [loading, setLoading]   = useState(true);

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
        .limit(500),
    ]);

    const diagList = diagResult.data ?? [];
    const viewList = viewResult.data ?? [];

    const viewsBySlug: Record<string,number> = {};
    let totalViews=0, totalCtas=0;
    viewList.forEach(v => {
      if(v.type==='view'){ totalViews++; viewsBySlug[v.slug]=(viewsBySlug[v.slug]??0)+1; }
      if(v.type==='cta') totalCtas++;
    });
    const topEntry = Object.entries(viewsBySlug).sort((a,b)=>b[1]-a[1])[0];

    setStats({
      total:    diagList.length,
      ativos:   diagList.filter(d=>d.ativo).length,
      views:    totalViews,
      ctas:     totalCtas,
      topSlug:  topEntry?.[0] ?? '—',
      topViews: topEntry?.[1] ?? 0,
    });
    setDiags(diagList);
    setRecentes(diagList.slice(0,3));
    setViews(viewList);
    setLoading(false);
  }

  const loaded = !loading && stats !== null;
  const cTotal  = useCounter(stats?.total  ?? 0, loaded);
  const cAtivos = useCounter(stats?.ativos ?? 0, loaded);
  const cViews  = useCounter(stats?.views  ?? 0, loaded);
  const cCtas   = useCounter(stats?.ctas   ?? 0, loaded);

  if (loading) {
    return <div style={{ padding:40, display:'flex', justifyContent:'center' }}><Spinner /></div>;
  }

  const convRate = stats && stats.views > 0
    ? ((stats.ctas / stats.views) * 100).toFixed(1)
    : '0';

  // Mini-analytics data
  const viewsBySlug: Record<string,number> = {};
  const ctasBySlug:  Record<string,number> = {};
  views.forEach(v => {
    if(v.type==='view') viewsBySlug[v.slug]=(viewsBySlug[v.slug]??0)+1;
    if(v.type==='cta')  ctasBySlug[v.slug] =(ctasBySlug[v.slug] ??0)+1;
  });
  const topViews = Object.entries(viewsBySlug).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const topCtas  = Object.entries(ctasBySlug) .sort((a,b)=>b[1]-a[1]).slice(0,3);
  const maxV = topViews[0]?.[1] ?? 1;
  const maxC = topCtas[0]?.[1]  ?? 1;

  // Period subtitle
  const midnight = new Date(); midnight.setHours(0,0,0,0);
  const todayViews = views.filter(v=>v.type==='view' && new Date(v.opened_at)>=midnight).length;
  const chartSub: Record<Period,string> = {
    hoje:  `${todayViews} views hoje${todayViews===0 ? ' · aguardando primeiros acessos' : ''}`,
    '7d':  `${stats?.views??0} views nos últimos 7 dias`,
    '30d': `${stats?.views??0} views nos últimos 30 dias`,
    total: `${stats?.views??0} views no total`,
  };

  // Activity feed
  type ActivityItem = { kind: 'ok'|'amber'; text: React.ReactNode; time: string };
  const activity: ActivityItem[] = [
    ...diags.slice(0,3).map(d => ({
      kind: 'ok' as const,
      text: <>Diagnóstico <strong>{d.empresa}</strong> criado com sucesso</>,
      time: new Date(d.criado_em).toLocaleDateString('pt-BR') + ' — status: ' + (d.ativo ? 'Ativo' : 'Inativo'),
    })),
    ...views.filter(v=>v.type==='cta').slice(0,3).map(v => ({
      kind: 'amber' as const,
      text: <>CTA clicado em <strong>{v.slug}</strong></>,
      time: new Date(v.opened_at).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }),
    })),
  ];
  if(stats?.views===0) {
    activity.push({
      kind: 'amber',
      text: 'Aguardando primeiros acessos via link público',
      time: 'Compartilhe o slug para começar a rastrear',
    });
  }

  const noTopSlug = !stats?.topSlug || stats.topSlug === '—';

  return (
    <div className="admin-content">
      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{cTotal}</div>
          <div className="stat-sub">diagnósticos criados</div>
        </div>
        <div className="stat-card ok-card">
          <div className="stat-label">Ativos</div>
          <div className="stat-value c-ok">{cAtivos}</div>
          <div className="stat-sub">
            <span style={{color:'var(--ok)'}}>●</span> {(stats?.total??0)-(stats?.ativos??0)} inativos
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Views Totais</div>
          <div className="stat-value">{cViews}</div>
          <div className="stat-sub">acessos únicos</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">CTAs Totais</div>
          <div className="stat-value c-amber">{cCtas}</div>
          <div className="stat-sub">cliques em CTA</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversão</div>
          <div className="stat-value">{convRate}%</div>
          <div className="stat-sub">CTAs / views</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mais Acessado</div>
          <div className={`stat-value ${noTopSlug ? 'c-mute' : ''}`}>
            {noTopSlug ? '—' : stats!.topSlug}
          </div>
          <div className="stat-sub">
            {noTopSlug ? 'sem acessos ainda' : `${stats?.topViews} views`}
          </div>
        </div>
      </div>

      {/* ── Period + chart ── */}
      <div className="period-row">
        <span className="period-label">Views ao longo do tempo</span>
        <div className="period-tabs">
          {(['hoje','7d','30d','total'] as Period[]).map(p => (
            <button
              key={p}
              className={`period-tab${period===p?' active':''}`}
              onClick={() => setPeriod(p)}
            >
              {p==='hoje'?'Hoje':p==='7d'?'7 dias':p==='30d'?'30 dias':'Total'}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-head">
          <div>
            <div className="chart-title">Tráfego de acessos</div>
            <div className="chart-sub">{chartSub[period]}</div>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="ld ld-amber" />Este período</div>
            <div className="legend-item"><div className="ld ld-dashed" />Período anterior</div>
          </div>
        </div>
        <ChartCanvas views={views} period={period} />
      </div>

      {/* ── Bottom grid ── */}
      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Atividade Recente</span>
          </div>
          <div className="activity-list">
            {activity.slice(0,6).map((item, i) => (
              <div
                key={i}
                className="activity-item"
                style={item.time.startsWith('Compartilhe') ? {opacity:0.45} : undefined}
              >
                <div className={`act-dot ${item.kind}`} />
                <div className="activity-body">
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Recentes</span>
            <Link to="/admin/diagnosticos" className="panel-action">ver todos →</Link>
          </div>
          {recentes.length === 0 ? (
            <div style={{ padding:'36px 18px', textAlign:'center', fontFamily:'var(--ff-mono)', fontSize:9, color:'var(--fg-faint)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
              Nenhum diagnóstico
            </div>
          ) : recentes.map(d => (
            <Link to="/admin/diagnosticos" key={d.id} className="recent-item">
              <div>
                <div className="recent-name">{d.empresa}</div>
                <div className="recent-date">{new Date(d.criado_em).toLocaleDateString('pt-BR')}</div>
              </div>
              <div className={`badge ${d.ativo?'badge-ok':'badge-warn'}`}>
                <span className="badge-dot" />{d.ativo?'Ativo':'Inativo'}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mini analytics ── */}
      <div className="analytics-row">
        <div className="analytics-card">
          <div className="analytics-label">Views por diagnóstico</div>
          <div className="bar-row">
            {topViews.length===0 ? (
              <div style={{color:'var(--fg-faint)',fontSize:11,fontFamily:'var(--ff-mono)'}}>Sem dados</div>
            ) : topViews.map(([slug,count]) => (
              <div key={slug} className="bar-item">
                <div className="bar-name">{slug.replace(/-/g,' ')}</div>
                <div className="bar-track"><div className="bar-fill" style={{width:`${(count/maxV)*100}%`}} /></div>
                <div className="bar-val">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-label">CTAs por diagnóstico</div>
          <div className="bar-row">
            {topCtas.length===0 ? (
              <div style={{color:'var(--fg-faint)',fontSize:11,fontFamily:'var(--ff-mono)'}}>Sem dados</div>
            ) : topCtas.map(([slug,count]) => (
              <div key={slug} className="bar-item">
                <div className="bar-name">{slug.replace(/-/g,' ')}</div>
                <div className="bar-track"><div className="bar-fill" style={{width:`${(count/maxC)*100}%`}} /></div>
                <div className="bar-val">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-label">Taxa de Conversão</div>
          <div className="donut-wrap">
            <DonutChart pct={Number(convRate)} />
            <div>
              <div className="donut-pct">{convRate}%</div>
              <div className="donut-sub">CTAs / views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
