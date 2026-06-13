import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DIAGNOSTICOS, fetchDiagnostico, type DiagnosticoData } from '../data/diagnosticos';
import { PROJECTS, type ProjectStatus } from '../data/projects';
import { DiagnosticoNotFound } from './DiagnosticoNotFound';
import { DiagnosticoExpirado } from './DiagnosticoExpirado';
import { useDiagReveal } from '../hooks/useDiagReveal';
import { useCountUp } from '../hooks/useCountUp';
import { Spinner } from '../components/Spinner';

// ─── Helpers ────────────────────────────────────────────────────────

function calcularScore(d: DiagnosticoData) {
  let presenca = 25;
  if (d.site) presenca += 30;
  if (d.plataformas.instagram?.ativo) presenca += 20;
  if (d.plataformas.facebook?.ativo) presenca += 10;
  if (d.plataformas.youtube) presenca += 10;
  if (d.plataformas.tiktok?.ativo) presenca += 5;
  presenca = Math.min(presenca, 100);

  const compComSite = d.competitors.filter(c => c.hasSite && !c.highlight).length;
  const totalComp   = d.competitors.filter(c => !c.highlight).length;
  let visibilidade  = d.site ? 60 : 10;
  if (totalComp > 0) visibilidade += Math.round((1 - compComSite / totalComp) * 40);
  visibilidade = Math.min(Math.max(visibilidade, 0), 100);

  const ratingScore = Math.round(((d.plataformas.googleBusiness.rating - 1) / 4) * 70);
  const reviewBonus = Math.min(Math.round(d.plataformas.googleBusiness.reviews / 3), 30);
  const reputacao   = Math.min(ratingScore + reviewBonus, 100);

  const geral = Math.round(presenca * 0.35 + visibilidade * 0.40 + reputacao * 0.25);
  return { geral, presenca, visibilidade, reputacao };
}

function volumeInfo(v: 'baixo' | 'médio' | 'alto') {
  if (v === 'baixo') return { label: '< 100/mês', color: '#E0B740', estimate: 40  };
  if (v === 'alto')  return { label: '> 1k/mês',  color: '#22C55E', estimate: 750 };
  return { label: '100–1k/mês', color: '#F28705', estimate: 200 };
}

function impactoStyle(i: 'alto' | 'médio' | 'baixo') {
  if (i === 'alto')  return { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#EF4444', label: 'ALTO' };
  if (i === 'médio') return { bg: 'rgba(242,135,5,0.12)',  border: 'rgba(242,135,5,0.3)',  color: '#F28705', label: 'MÉDIO' };
  return               { bg: 'rgba(224,183,64,0.12)', border: 'rgba(224,183,64,0.3)', color: '#E0B740', label: 'BAIXO' };
}

const CAT_LABEL: Record<string, string> = {
  busca:     'BUSCA ORGÂNICA',
  redes:     'REDES SOCIAIS',
  reputacao: 'REPUTAÇÃO',
  site:      'SITE',
  conversao: 'CONVERSÃO',
};

const SVC_INFO: Record<string, { icon: string; label: string }> = {
  'site':          { icon: '◉', label: 'Site Web'       },
  'seo-local':     { icon: '⌖', label: 'SEO Local'      },
  'google-perfil': { icon: '⊙', label: 'Google Perfil'  },
  'social':        { icon: '◈', label: 'Social Media'   },
  'google-ads':    { icon: '▲', label: 'Google Ads'     },
  'conteudo':      { icon: '≡', label: 'Conteúdo'       },
};

function statusColor(s: ProjectStatus): string {
  if (s === 'LIVE') return '#22C55E';
  if (s === 'BETA') return '#F28705';
  return 'var(--fg-mute)';
}

const CIRC = 289; // 2π × 46

// ─── Component ───────────────────────────────────────────────────────

export function Diagnostico() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DiagnosticoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fichaOpen, setFichaOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const remote = await fetchDiagnostico(slug ?? '');
      if (remote) { setData(remote); setLoading(false); return; }
      const local = DIAGNOSTICOS.find(d => d.slug === slug);
      setData(local ?? null);
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (slug) localStorage.setItem('last_diagnostico_slug', slug);
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    document.querySelectorAll<HTMLElement>(
      '.diag-page [data-anim], .diag-page .diag-pills-wrap, ' +
      '.diag-page .diag-platform-grid, .diag-page .diag-problem-list, ' +
      '.diag-page .diag-recs-list, .diag-page .diag-cta-block, ' +
      '.diag-page .diag-counter, .diag-page .ba-item'
    ).forEach(el => el.setAttribute('data-revealed', 'true'));
  }, [data]);

  // Pre-compute for count-up hooks (hooks must be before early returns)
  const preScore = data ? calcularScore(data) : { geral: 0, presenca: 0, visibilidade: 0, reputacao: 0 }
  const preVol   = data ? volumeInfo(data.busca.volumeEstimado) : { label: '', color: '', estimate: 0 }
  const preGb    = data?.plataformas.googleBusiness

  const { value: gaugeDisplay,   ref: gaugeCountRef }   = useCountUp<SVGSVGElement>(preScore.geral,            { duration: 1100, delay: 400 })
  const { value: presencaDisplay, ref: presencaValRef } = useCountUp<HTMLSpanElement>(preScore.presenca,       { duration: 900,  delay: 650 })
  const { value: visibDisplay,   ref: visibValRef }     = useCountUp<HTMLSpanElement>(preScore.visibilidade,   { duration: 900,  delay: 800 })
  const { value: repDisplay,     ref: repValRef }       = useCountUp<HTMLSpanElement>(preScore.reputacao,      { duration: 900,  delay: 950 })
  const { value: ratingDisplay,  ref: ratingRef }       = useCountUp<HTMLDivElement>(preGb?.rating ?? 0,      { duration: 800,  delay: 250, decimals: 1 })
  const { value: reviewsDisplay, ref: reviewsRef }      = useCountUp<HTMLDivElement>(preGb?.reviews ?? 0,     { duration: 900,  delay: 380 })
  const { value: costDisplay,    ref: costCountRef }    = useCountUp<HTMLDivElement>(preVol.estimate,         { duration: 1000, delay: 200 })

  // Hero
  const scoreRef         = useDiagReveal<HTMLDivElement>(100);
  const pillsRef         = useDiagReveal<HTMLDivElement>(350);
  const heroStatementRef = useDiagReveal<HTMLHeadingElement>(550);
  const heroSubRef       = useDiagReveal<HTMLParagraphElement>(750);

  // Sections
  const platformsRef = useDiagReveal<HTMLDivElement>();
  const s3HeaderRef  = useDiagReveal<HTMLDivElement>();
  const s3ParaRef    = useDiagReveal<HTMLParagraphElement>();
  const s3TableRef   = useDiagReveal<HTMLTableElement>();
  const s3StatRef    = useDiagReveal<HTMLDivElement>();
  const s4HeaderRef  = useDiagReveal<HTMLDivElement>();
  const s4LeftRef    = useDiagReveal<HTMLDivElement>();
  const s4CounterRef = useDiagReveal<HTMLDivElement>();
  const s5HeaderRef  = useDiagReveal<HTMLDivElement>();
  const s5ListRef    = useDiagReveal<HTMLDivElement>();
  const baRef0       = useDiagReveal<HTMLDivElement>();
  const baRef1       = useDiagReveal<HTMLDivElement>();
  const baRef2       = useDiagReveal<HTMLDivElement>();
  const baRefs       = [baRef0, baRef1, baRef2];
  const s7HeaderRef  = useDiagReveal<HTMLDivElement>();
  const s7ListRef    = useDiagReveal<HTMLDivElement>();
  const s8Ref        = useDiagReveal<HTMLDivElement>();
  const stepsRef     = useDiagReveal<HTMLDivElement>();
  const ctaRef       = useDiagReveal<HTMLDivElement>();
  const bridgeRef    = useDiagReveal<HTMLDivElement>();

  if (loading) return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>;
  if (!data) return <DiagnosticoNotFound />;
  if (!data.ativo) return <DiagnosticoExpirado />;

  const score            = preScore;
  const vol              = preVol;
  const dashoffset       = Math.round(CIRC - (score.geral / 100) * CIRC);
  const compWithSite     = data.competitors.filter(c => c.hasSite && !c.highlight).length;
  const baCards          = data.recomendacoes.filter(r => r.antes && r.depois).slice(0, 3);
  const bridgeProjects   = PROJECTS.slice(0, 3);

  const gb = data.plataformas.googleBusiness;
  const gbActive = [gb.verificado, gb.temFotos, gb.horarioPreenchido, gb.categoriasOk].filter(Boolean).length;
  const gbStatus: 'presente' | 'fraco' = gbActive >= 3 ? 'presente' : 'fraco';

  const platforms = [
    {
      key: 'site',
      label: 'Website',
      icon: '◉',
      status: (data.site
        ? (data.site.qualidade !== 'básico' ? 'presente' : 'fraco')
        : 'ausente') as 'presente' | 'fraco' | 'ausente',
      metric: data.site ? data.site.url : undefined,
    },
    {
      key: 'google',
      label: 'Google Business',
      icon: 'G',
      status: gbStatus,
      metric: `${gb.rating}★ · ${gb.reviews} av.`,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: '⊞',
      status: (data.plataformas.instagram
        ? (data.plataformas.instagram.ativo ? 'presente' : 'fraco')
        : 'ausente') as 'presente' | 'fraco' | 'ausente',
      metric: data.plataformas.instagram
        ? `${data.plataformas.instagram.seguidores} seg.`
        : undefined,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'f',
      status: (data.plataformas.facebook
        ? (data.plataformas.facebook.ativo ? 'presente' : 'fraco')
        : 'ausente') as 'presente' | 'fraco' | 'ausente',
      metric: data.plataformas.facebook
        ? `${data.plataformas.facebook.seguidores} seg.`
        : undefined,
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: '▶',
      status: (data.plataformas.youtube ? 'presente' : 'ausente') as 'presente' | 'fraco' | 'ausente',
      metric: data.plataformas.youtube
        ? `${data.plataformas.youtube.inscritos} inscritos`
        : undefined,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: '♪',
      status: (data.plataformas.tiktok
        ? (data.plataformas.tiktok.ativo ? 'presente' : 'fraco')
        : 'ausente') as 'presente' | 'fraco' | 'ausente',
      metric: data.plataformas.tiktok
        ? `${data.plataformas.tiktok.seguidores} seg.`
        : undefined,
    },
  ];

  const STATUS_ICON  = { presente: '✓', fraco: '~', ausente: '✕' } as const;
  const STATUS_COLOR = { presente: '#22C55E', fraco: '#E0B740', ausente: '#EF4444' } as const;

  const steps = [
    {
      n: '01',
      title: '15 min de conversa',
      desc: `Sem compromisso. Entendo o que ${data.empresa} precisa e mostro o conceito visual do site.`,
    },
    {
      n: '02',
      title: 'Proposta personalizada',
      desc: 'Preparo opções de investimento — do essencial ao completo. Você escolhe o que faz sentido.',
    },
    {
      n: '03',
      title: `Site no ar em ${data.prazo}`,
      desc: `Com SEO configurado, ${data.empresa} começa a aparecer no Google para buscas de ${data.segmento}.`,
    },
  ];

  return (
    <main data-theme="dark" className="diag-page">
      <div className="diag-content">

        {/* 01 — HERO */}
        <section className="diag-hero">
          <div className="diag-hero-top">
            <p className="diag-overline">
              DIAGNÓSTICO DE PRESENÇA DIGITAL · {data.dataGerado.slice(0, 4)}
            </p>
            <span className="diag-confidential">DOCUMENTO CONFIDENCIAL</span>
          </div>

          <div
            ref={scoreRef}
            className="diag-score-wrap"
            data-anim="fade-up"
            style={{ '--gauge-offset': String(dashoffset) } as React.CSSProperties}
          >
            <svg ref={gaugeCountRef} viewBox="0 0 100 100" className="diag-gauge-svg">
              <circle className="diag-gauge-track" cx="50" cy="50" r="46" />
              <circle
                className="diag-gauge-fill"
                cx="50" cy="50" r="46"
                strokeDasharray={CIRC}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="47" className="diag-gauge-number">{gaugeDisplay}</text>
              <text x="50" y="62" className="diag-gauge-sub">/ 100</text>
            </svg>
            <div className="diag-score-legend">
              <div className="diag-score-row">
                <span className="diag-score-dot" style={{ background: '#F28705' }} />
                <span className="diag-score-name">Presença</span>
                <span ref={presencaValRef} className="diag-score-val">{presencaDisplay}</span>
              </div>
              <div className="diag-score-row">
                <span className="diag-score-dot" style={{ background: '#EF4444' }} />
                <span className="diag-score-name">Visibilidade</span>
                <span ref={visibValRef} className="diag-score-val">{visibDisplay}</span>
              </div>
              <div className="diag-score-row">
                <span className="diag-score-dot" style={{ background: '#22C55E' }} />
                <span className="diag-score-name">Reputação</span>
                <span ref={repValRef} className="diag-score-val">{repDisplay}</span>
              </div>
            </div>
          </div>

          <div ref={pillsRef} className="diag-pills-wrap diag-stat-pills">
            <div className="diag-pill diag-stat-pill">
              <div ref={ratingRef} className="diag-stat-number diag-stat-amber">{ratingDisplay.toFixed(1)}★</div>
              <div className="diag-stat-label">nota no Google</div>
            </div>
            <div className="diag-pill diag-stat-pill">
              <div ref={reviewsRef} className="diag-stat-number">{reviewsDisplay}</div>
              <div className="diag-stat-label">avaliações</div>
            </div>
          </div>

          <h1
            ref={heroStatementRef}
            className="diag-hero-statement"
            data-anim="fade-up"
          >
            Seus concorrentes aparecem no Google.
            <br />
            {data.empresa} não.
          </h1>

          <p ref={heroSubRef} className="diag-hero-sub" data-anim="fade-in">
            {data.cidade} · {data.estado} · {data.segmento}
          </p>

          <div className="diag-amber-rule" />
        </section>
        <hr className="diag-rule" />

        {/* 02 — PRESENÇA NAS PLATAFORMAS */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">02</span>
            <span className="diag-label-text">PRESENÇA NAS PLATAFORMAS</span>
          </div>
          <div ref={platformsRef} className="diag-platform-grid">
            {platforms.map(p => (
              <div
                key={p.key}
                className="diag-platform-card"
                data-status={p.status}
              >
                <div className="diag-platform-icon">{p.icon}</div>
                <div className="diag-platform-name">{p.label}</div>
                <div
                  className="diag-platform-status"
                  style={{ color: STATUS_COLOR[p.status] }}
                >
                  <span>{STATUS_ICON[p.status]}</span>
                  {p.status === 'presente' ? ' Ativo' : p.status === 'fraco' ? ' Fraco' : ' Ausente'}
                </div>
                {p.metric && (
                  <div className="diag-platform-metric">{p.metric}</div>
                )}
              </div>
            ))}
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 03 — A BUSCA QUE VOCÊ ESTÁ PERDENDO */}
        <section className="diag-section">
          <div ref={s3HeaderRef} className="diag-section-label" data-anim="slide-left">
            <span className="diag-n">03</span>
            <span className="diag-label-text">A BUSCA QUE VOCÊ ESTÁ PERDENDO AGORA</span>
          </div>

          <div className="diag-search-row">
            <p ref={s3ParaRef} className="diag-search-headline" data-anim="fade-up">
              Quando alguém pesquisa{' '}
              <span className="diag-search-term">"{data.busca.palavraChave}"</span>
              {' '}no Google, a {data.empresa} não aparece.
            </p>
            <div
              className="diag-volume-badge"
              style={{ borderColor: vol.color, color: vol.color }}
            >
              <span className="diag-volume-eyebrow">VOLUME</span>
              <span className="diag-volume-val">{vol.label}</span>
            </div>
          </div>

          {/* Desktop table */}
          <div className="diag-table-wrap">
            <table ref={s3TableRef} className="diag-table" data-stagger>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Nota</th>
                  <th>Avaliações</th>
                  <th>Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors.map(c => (
                  <tr key={c.name} className={c.highlight ? 'highlight' : undefined}>
                    <td style={c.highlight ? { color: '#F28705', fontWeight: 700 } : undefined}>
                      {c.name}
                    </td>
                    <td>{c.rating}</td>
                    <td>{c.reviews}</td>
                    <td style={{ color: c.hasSite ? '#22C55E' : '#EF4444' }}>
                      {c.hasSite ? 'Sim' : 'Não'}
                    </td>
                    <td style={{ color: c.status === 'Aparece' ? '#22C55E' : '#EF4444' }}>
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked */}
          <div className="diag-competitors-mobile">
            {data.competitors.map(c => (
              <dl
                key={c.name}
                className={`diag-competitor-card${c.highlight ? ' highlight' : ''}`}
              >
                <dt>Empresa</dt>
                <dd style={c.highlight ? { color: '#F28705', fontWeight: 700 } : undefined}>
                  {c.name}
                </dd>
                <dt>Nota</dt>
                <dd>{c.rating} ★</dd>
                <dt>Avaliações</dt>
                <dd>{c.reviews}</dd>
                <dt>Site</dt>
                <dd style={{ color: c.hasSite ? '#22C55E' : '#EF4444' }}>
                  {c.hasSite ? 'Sim' : 'Não'}
                </dd>
                <dt>Status</dt>
                <dd style={{ color: c.status === 'Aparece' ? '#22C55E' : '#EF4444' }}>
                  {c.status}
                </dd>
              </dl>
            ))}
          </div>

          <div ref={s3StatRef} className="diag-competitor-callout" data-anim="scale-in">
            <p className="diag-callout-main">
              {compWithSite} concorrentes com site. Nenhum tem sua nota.
            </p>
            <p className="diag-callout-sub">Você tem o produto. Falta o canal.</p>
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 04 — O CUSTO DA INVISIBILIDADE */}
        <section className="diag-section">
          <div ref={s4HeaderRef} className="diag-section-label" data-anim="slide-left">
            <span className="diag-n">04</span>
            <span className="diag-label-text">O CUSTO DA INVISIBILIDADE</span>
          </div>
          <div className="diag-cost-card">
            <div ref={s4LeftRef} className="diag-cost-left" data-anim="fade-up" data-stagger>
              <p className="diag-cost-eyebrow">ESTIMATIVA CONSERVADORA</p>
              <p className="diag-cost-statement">
                Se apenas 10 pessoas buscam{' '}
                <span className="diag-search-term">"{data.busca.palavraChave}"</span>
                {' '}por dia...
              </p>
              <ul className="diag-cost-list">
                <li className="diag-cost-item">
                  <span className="diag-cost-dot">●</span>
                  <span>…{data.empresa} não aparece para nenhuma delas.</span>
                </li>
                <li className="diag-cost-item">
                  <span className="diag-cost-dot">●</span>
                  <span>Dessas 10, metade já tem intenção de compra.</span>
                </li>
                <li className="diag-cost-item">
                  <span className="diag-cost-dot">●</span>
                  <span>São ~{vol.estimate} clientes potenciais por mês indo para a concorrência.</span>
                </li>
              </ul>
            </div>
            <div ref={costCountRef} className="diag-cost-right">
              <div ref={s4CounterRef} className="diag-counter diag-cost-big-n">{costDisplay}+</div>
              <div className="diag-cost-big-label">
                CLIENTES/MÊS
                <br />
                FORA DO SEU ALCANCE
              </div>
            </div>
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 05 — DIAGNÓSTICO DETALHADO */}
        <section className="diag-section">
          <div ref={s5HeaderRef} className="diag-section-label" data-anim="slide-left">
            <span className="diag-n">05</span>
            <span className="diag-label-text">DIAGNÓSTICO DETALHADO</span>
          </div>
          <p className="diag-section-sub">Problemas por categoria e nível de impacto.</p>

          <div ref={s5ListRef} className="diag-problem-list">
            {data.problemas.map((p, i) => {
              const imp = impactoStyle(p.impacto);
              return (
                <div key={i} className="diag-problem-card">
                  <div className="diag-problem-meta">
                    <span className="diag-problem-cat">
                      {CAT_LABEL[p.categoria] ?? p.categoria.toUpperCase()}
                    </span>
                    <span
                      className="diag-problem-impact"
                      style={{ background: imp.bg, borderColor: imp.border, color: imp.color }}
                    >
                      IMPACTO {imp.label}
                    </span>
                  </div>
                  <p className="diag-problem-title">{p.titulo}</p>
                  <p className="diag-problem-desc">{p.descricao}</p>
                </div>
              );
            })}
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 06 — O QUE MUDA (before/after from recomendacoes) */}
        {baCards.length > 0 && (
          <>
            <section className="diag-section">
              <div className="diag-section-label">
                <span className="diag-n">06</span>
                <span className="diag-label-text">O QUE MUDA COM UM SITE</span>
              </div>
              <p className="diag-section-sub">Transformação direta para cada problema identificado.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                {baCards.map((card, i) => (
                  <div key={i} ref={baRefs[i]} className="ba-item">
                    <div className="ba-before">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                          width: 18, height: 18, background: 'rgba(239,68,68,0.15)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#EF4444', fontSize: 10, flexShrink: 0,
                        }}>✕</span>
                        <span style={{
                          fontFamily: 'var(--ff-mono)', fontSize: 10,
                          letterSpacing: '0.12em', color: '#EF4444', textTransform: 'uppercase',
                        }}>Antes</span>
                      </div>
                      <p style={{
                        fontSize: 15, fontStyle: 'italic',
                        color: 'rgba(242,242,242,0.40)',
                        textDecoration: 'line-through',
                        textDecorationColor: 'rgba(239,68,68,0.35)',
                        lineHeight: 1.5, margin: 0,
                      }}>{card.antes}</p>
                    </div>

                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', height: 56, position: 'relative',
                    }}>
                      <div className="ba-connector-line" />
                      <div className="ba-connector-pill">↓ transforma em</div>
                    </div>

                    <div className="ba-after">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                          width: 18, height: 18, background: 'rgba(34,197,94,0.15)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#22C55E', fontSize: 10, flexShrink: 0,
                        }}>✓</span>
                        <span style={{
                          fontFamily: 'var(--ff-mono)', fontSize: 10,
                          letterSpacing: '0.12em', color: '#22C55E', textTransform: 'uppercase',
                        }}>Depois</span>
                      </div>
                      <p style={{
                        fontSize: 16, fontWeight: 600,
                        color: '#F2F2F2', lineHeight: 1.5, margin: 0,
                      }}>{card.depois}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <hr className="diag-rule" />
          </>
        )}

        {/* 07 — RECOMENDAÇÕES PRIORIZADAS */}
        <section className="diag-section">
          <div ref={s7HeaderRef} className="diag-section-label" data-anim="slide-left">
            <span className="diag-n">07</span>
            <span className="diag-label-text">RECOMENDAÇÕES PRIORIZADAS</span>
          </div>
          <p className="diag-section-sub">Ações ordenadas por impacto e esforço.</p>

          <div ref={s7ListRef} className="diag-recs-list">
            {data.recomendacoes.map((r, i) => {
              const svc = SVC_INFO[r.servico] ?? { icon: '●', label: r.servico };
              return (
                <div key={i} className="diag-rec-item">
                  <div className="diag-rec-priority">{r.prioridade}</div>
                  <div className="diag-rec-body">
                    <div className="diag-rec-header">
                      <span className="diag-rec-icon">{svc.icon}</span>
                      <span className="diag-rec-service">{svc.label}</span>
                    </div>
                    <p className="diag-rec-title">{r.titulo}</p>
                    <p className="diag-rec-desc">{r.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 08 — FICHA DO NEGÓCIO */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">08</span>
            <span className="diag-label-text">FICHA DO NEGÓCIO</span>
          </div>
          <div ref={s8Ref} className="diag-kv-list" data-anim="fade-up">
            <div className="diag-kv">
              <span className="diag-kv-key">Empresa</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.empresa}</span>
            </div>
            <div className="diag-kv">
              <span className="diag-kv-key">Google</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">
                {gb.rating} ★ · {gb.reviews} avaliações
              </span>
            </div>
            <div className="diag-kv">
              <span className="diag-kv-key">Website</span>
              <span className="diag-kv-dots" />
              <span
                className="diag-kv-val"
                style={!data.site ? { color: '#EF4444' } : undefined}
              >
                {data.site ? data.site.url : 'Nenhum'}
              </span>
            </div>
            {data.plataformas.instagram && (
              <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
                <span className="diag-kv-key">Instagram</span>
                <span className="diag-kv-dots" />
                <span className="diag-kv-val">
                  {data.plataformas.instagram.handle} · {data.plataformas.instagram.seguidores} seg.
                </span>
              </div>
            )}
            {data.plataformas.facebook && (
              <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
                <span className="diag-kv-key">Facebook</span>
                <span className="diag-kv-dots" />
                <span className="diag-kv-val">
                  {data.plataformas.facebook.handle} · {data.plataformas.facebook.seguidores} seg.
                </span>
              </div>
            )}
            <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
              <span className="diag-kv-key">Endereço</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.endereco}</span>
            </div>
            <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
              <span className="diag-kv-key">Telefone</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.telefone}</span>
            </div>
            <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
              <span className="diag-kv-key">Especialidade</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.especialidade}</span>
            </div>
          </div>
          <button
            className="diag-ficha-toggle"
            onClick={() => setFichaOpen(o => !o)}
          >
            {fichaOpen ? 'Ver menos ↑' : 'Ver dados completos ↓'}
          </button>
        </section>
        <hr className="diag-rule" />

        {/* 09 — PRÓXIMOS PASSOS + CTA */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">09</span>
            <span className="diag-label-text">PRÓXIMOS PASSOS</span>
          </div>
          <div ref={stepsRef} className="diag-steps" data-stagger>
            {steps.map(s => (
              <div key={s.n} className="diag-step">
                <span className="diag-step-n">{s.n}</span>
                <p className="diag-step-title">{s.title}</p>
                <p className="diag-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div ref={ctaRef} className="diag-cta-v2 diag-cta-block">
            <p className="diag-cta-eyebrow">PRÓXIMO PASSO</p>
            <p className="diag-cta-headline">Quero ver o conceito do site →</p>
            <p className="diag-cta-sub">
              15 min de conversa. Sem compromisso. Mostro o layout completo antes de qualquer
              proposta de valor.
            </p>
            <a
              href={`https://wa.me/${data.ctaWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="diag-cta-btn"
            >
              FALAR NO WHATSAPP →
            </a>
            <p className="diag-cta-note">Respondo em até 24h · adryann.dev</p>
          </div>
        </section>

        {/* 10 — CREDIBILIDADE + BRIDGE */}
        <hr className="diag-rule" />
        <section className="diag-section">
          <p className="diag-bridge-name">// ADRYANN FELIX</p>
          <div ref={bridgeRef} className="diag-bridge-v2" data-anim="fade-up">
            <div className="diag-bridge-left">
              <p className="diag-bridge-intro">Software Engineer · Foz do Iguaçu, BR</p>
              <p className="diag-bridge-para">
                Desenvolvo sites para negócios locais que querem crescer com presença digital
                real — não templates genéricos.
              </p>
              <p className="diag-bridge-projects-label">PROJETOS ENTREGUES RECENTEMENTE:</p>
              <ul className="diag-bridge-projects">
                {bridgeProjects.map(p =>
                  p.slug ? (
                    <li key={p.n}>
                      <Link to={`/work/${p.slug}`} className="diag-bridge-project-row">
                        <span className="diag-bridge-project-name">→ {p.title}</span>
                        <span
                          className="diag-bridge-project-badge"
                          style={{ color: statusColor(p.status) }}
                        >
                          {p.status}
                        </span>
                      </Link>
                    </li>
                  ) : (
                    <li key={p.n}>
                      <div className="diag-bridge-project-row diag-bridge-project-row--static">
                        <span className="diag-bridge-project-name">→ {p.title}</span>
                        <span
                          className="diag-bridge-project-badge"
                          style={{ color: statusColor(p.status) }}
                        >
                          {p.status}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="diag-bridge-right">
              <div className="diag-bridge-btns">
                <Link to="/" className="diag-bridge-btn diag-bridge-btn--primary">
                  Ver portfólio completo →
                </Link>
                <a
                  href={`https://wa.me/${data.ctaWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diag-bridge-btn diag-bridge-btn--ghost"
                >
                  Falar no WhatsApp →
                </a>
              </div>
              <p className="diag-bridge-footer">adryann.dev · Foz do Iguaçu, PR</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
