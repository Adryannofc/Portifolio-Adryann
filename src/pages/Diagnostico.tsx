import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DIAGNOSTICOS } from '../data/diagnosticos';
import { PROJECTS, type ProjectStatus } from '../data/projects';
import { DiagnosticoNotFound } from './DiagnosticoNotFound';
import { useDiagReveal } from '../hooks/useDiagReveal';

function statusColor(status: ProjectStatus): string {
  if (status === 'LIVE') return '#22C55E';
  if (status === 'BETA') return '#F28705';
  return 'var(--fg-mute)';
}

export function Diagnostico() {
  const { slug } = useParams<{ slug: string }>();
  const data = DIAGNOSTICOS.find((d) => d.slug === slug);
  const [fichaOpen, setFichaOpen] = useState(false);

  // Hero — delay-based: elements are in-viewport on mount, delay creates stagger
  const pillsRef         = useDiagReveal<HTMLDivElement>(200);
  const heroStatementRef = useDiagReveal<HTMLHeadingElement>(400);
  const heroSubRef       = useDiagReveal<HTMLParagraphElement>(600);

  // Section 02
  const s2HeaderRef = useDiagReveal<HTMLDivElement>();
  const s2ParaRef   = useDiagReveal<HTMLParagraphElement>();
  const s2TableRef  = useDiagReveal<HTMLTableElement>();
  const s2StatRef   = useDiagReveal<HTMLDivElement>();

  // Section 03
  const s3HeaderRef  = useDiagReveal<HTMLDivElement>();
  const s3LeftRef    = useDiagReveal<HTMLDivElement>();
  const s3CounterRef = useDiagReveal<HTMLDivElement>();

  // Section 04 — one ref per ba-item (Rules of Hooks: no hooks inside loops)
  const baRef0 = useDiagReveal<HTMLDivElement>();
  const baRef1 = useDiagReveal<HTMLDivElement>();
  const baRef2 = useDiagReveal<HTMLDivElement>();
  const baRefs = [baRef0, baRef1, baRef2];

  // Section 05
  const s5Ref = useDiagReveal<HTMLDivElement>();

  // Section 06
  const stepsRef = useDiagReveal<HTMLDivElement>();
  const ctaRef   = useDiagReveal<HTMLDivElement>();

  // Section 07
  const bridgeRef = useDiagReveal<HTMLDivElement>();

  if (!data) return <DiagnosticoNotFound />;

  const bridgeProjects = PROJECTS.slice(0, 3);
  const competitorsWithSite = data.competitors.filter((c) => c.hasSite && !c.highlight).length;

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

  const beforeAfterCards = [
    {
      before: 'Invisível nas buscas do Google',
      after: `Aparece quando alguém busca "${data.segmento} ${data.cidade}"`,
    },
    {
      before: 'Especialização Apple enterrada nas avaliações',
      after: 'Posicionamento Apple na primeira dobra do site',
    },
    {
      before: 'Contato só por indicação ou quem já conhece',
      after: 'WhatsApp direto da busca — cliente chega pronto para comprar',
    },
  ];

  return (
    <main data-theme="dark" className="diag-page">
      <div className="diag-content">

        {/* 01 — HERO */}
        <section className="diag-hero">
          <div className="diag-hero-top">
            <p className="diag-overline">
              DIAGNÓSTICO DE PRESENÇA DIGITAL · {data.ano}
            </p>
            <span className="diag-confidential">DOCUMENTO CONFIDENCIAL</span>
          </div>

          <div ref={pillsRef} className="diag-pills-wrap diag-stat-pills">
            <div className="diag-pill diag-stat-pill">
              <div className="diag-stat-number diag-stat-amber">{data.google.rating}★</div>
              <div className="diag-stat-label">nota no Google</div>
            </div>
            <div className="diag-pill diag-stat-pill">
              <div className="diag-stat-number">{data.google.reviews}</div>
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

          <p
            ref={heroSubRef}
            className="diag-hero-sub"
            data-anim="fade-in"
          >
            {data.cidade} · {data.estado} · {data.segmento}
          </p>

          <div className="diag-amber-rule" />
        </section>
        <hr className="diag-rule" />

        {/* 02 — A BUSCA QUE VOCÊ ESTÁ PERDENDO */}
        <section className="diag-section">
          <div
            ref={s2HeaderRef}
            className="diag-section-label"
            data-anim="slide-left"
          >
            <span className="diag-n">02</span>
            <span className="diag-label-text">A BUSCA QUE VOCÊ ESTÁ PERDENDO AGORA</span>
          </div>
          <p
            ref={s2ParaRef}
            className="diag-search-headline"
            data-anim="fade-up"
          >
            Quando alguém pesquisa{' '}
            <span className="diag-search-term">"{data.problemaBusca}"</span>
            {' '}no Google, a {data.empresa} não aparece — mesmo tendo nota melhor que a maioria
            dos concorrentes.
          </p>

          {/* Desktop table */}
          <div className="diag-table-wrap">
            <table ref={s2TableRef} className="diag-table" data-stagger>
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
                {data.competitors.map((c) => (
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
            {data.competitors.map((c) => (
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

          <div
            ref={s2StatRef}
            className="diag-competitor-callout"
            data-anim="scale-in"
          >
            <p className="diag-callout-main">
              {competitorsWithSite} concorrentes com site. Nenhum tem sua nota.
            </p>
            <p className="diag-callout-sub">Você tem o produto. Falta o canal.</p>
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 03 — O CUSTO DA INVISIBILIDADE */}
        <section className="diag-section">
          <div
            ref={s3HeaderRef}
            className="diag-section-label"
            data-anim="slide-left"
          >
            <span className="diag-n">03</span>
            <span className="diag-label-text">O CUSTO DA INVISIBILIDADE</span>
          </div>
          <div className="diag-cost-card">
            <div
              ref={s3LeftRef}
              className="diag-cost-left"
              data-anim="fade-up"
              data-stagger
            >
              <p className="diag-cost-eyebrow">ESTIMATIVA CONSERVADORA</p>
              <p className="diag-cost-statement">
                Se apenas 10 pessoas buscam{' '}
                <span className="diag-search-term">"{data.problemaBusca}"</span>
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
                  <span>São ~150 clientes potenciais por mês indo para a concorrência.</span>
                </li>
              </ul>
            </div>
            <div className="diag-cost-right">
              <div ref={s3CounterRef} className="diag-counter diag-cost-big-n">150+</div>
              <div className="diag-cost-big-label">
                CLIENTES/MÊS
                <br />
                FORA DO SEU ALCANCE
              </div>
            </div>
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 04 — O QUE MUDA COM UM SITE — vertical timeline */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">04</span>
            <span className="diag-label-text">O QUE MUDA COM UM SITE</span>
          </div>
          <p className="diag-section-sub">Três problemas resolvidos ao mesmo tempo.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {beforeAfterCards.map((card, i) => (
              <div key={i} ref={baRefs[i]} className="ba-item">

                {/* BEFORE */}
                <div className="ba-before">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      width: 18, height: 18,
                      background: 'rgba(239,68,68,0.15)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#EF4444', fontSize: 10, flexShrink: 0,
                    }}>✕</span>
                    <span style={{
                      fontFamily: 'var(--ff-mono)',
                      fontSize: 10, letterSpacing: '0.12em',
                      color: '#EF4444', textTransform: 'uppercase',
                    }}>Antes</span>
                  </div>
                  <p style={{
                    fontSize: 15, fontStyle: 'italic',
                    color: 'rgba(242,242,242,0.40)',
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(239,68,68,0.35)',
                    textDecorationThickness: 1,
                    lineHeight: 1.5, margin: 0,
                  }}>{card.before}</p>
                </div>

                {/* CONNECTOR */}
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', height: 56, position: 'relative',
                }}>
                  <div className="ba-connector-line" />
                  <div className="ba-connector-pill">↓ transforma em</div>
                </div>

                {/* AFTER */}
                <div className="ba-after">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      width: 18, height: 18,
                      background: 'rgba(34,197,94,0.15)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#22C55E', fontSize: 10, flexShrink: 0,
                    }}>✓</span>
                    <span style={{
                      fontFamily: 'var(--ff-mono)',
                      fontSize: 10, letterSpacing: '0.12em',
                      color: '#22C55E', textTransform: 'uppercase',
                    }}>Depois</span>
                  </div>
                  <p style={{
                    fontSize: 16, fontWeight: 600,
                    color: '#F2F2F2', lineHeight: 1.5, margin: 0,
                  }}>{card.after}</p>
                </div>

              </div>
            ))}
          </div>
        </section>
        <hr className="diag-rule" />

        {/* 05 — FICHA DO NEGÓCIO */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">05</span>
            <span className="diag-label-text">FICHA DO NEGÓCIO</span>
          </div>
          <div ref={s5Ref} className="diag-kv-list" data-anim="fade-up">
            <div className="diag-kv">
              <span className="diag-kv-key">Empresa</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.empresa}</span>
            </div>
            <div className="diag-kv">
              <span className="diag-kv-key">Google</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">
                {data.google.rating} ★ · {data.google.reviews} avaliações
              </span>
            </div>
            <div className="diag-kv">
              <span className="diag-kv-key">Site</span>
              <span className="diag-kv-dots" />
              <span
                className="diag-kv-val"
                style={data.temSite ? undefined : { color: '#EF4444' }}
              >
                {data.temSite ? 'Sim' : 'Nenhum'}
              </span>
            </div>
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
            {data.instagram && (
              <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
                <span className="diag-kv-key">Instagram</span>
                <span className="diag-kv-dots" />
                <span className="diag-kv-val">
                  {data.instagram.handle} · {data.instagram.followers} seguidores
                </span>
              </div>
            )}
            <div className={`diag-kv diag-kv-extra${fichaOpen ? ' diag-kv-expanded' : ''}`}>
              <span className="diag-kv-key">Especialidade</span>
              <span className="diag-kv-dots" />
              <span className="diag-kv-val">{data.especialidade}</span>
            </div>
          </div>
          <button
            className="diag-ficha-toggle"
            onClick={() => setFichaOpen((o) => !o)}
          >
            <span>{fichaOpen ? 'Ver menos ↑' : 'Ver dados completos ↓'}</span>
          </button>
        </section>
        <hr className="diag-rule" />

        {/* 06 — PRÓXIMOS PASSOS + CTA */}
        <section className="diag-section">
          <div className="diag-section-label">
            <span className="diag-n">06</span>
            <span className="diag-label-text">PRÓXIMOS PASSOS</span>
          </div>
          <div ref={stepsRef} className="diag-steps" data-stagger>
            {steps.map((s) => (
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

        {/* 07 — CREDIBILIDADE + BRIDGE */}
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
                {bridgeProjects.map((p) =>
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
                  ),
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
