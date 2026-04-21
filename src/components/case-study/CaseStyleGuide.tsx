import type { CSSProperties } from 'react';
import type { CaseStudyContent, ComponentToken, TypographyRow } from '../../data/projects';
import { useTypewriter } from '../../hooks/useTypewriter';

interface Props {
  cs: CaseStudyContent;
}

function TypeSampleRow({ row }: { row: TypographyRow }) {
  const sampleClass =
    row.role.toLowerCase().startsWith('display')
      ? 'display'
      : row.role.toLowerCase().startsWith('mono')
        ? 'mono'
        : 'body';

  const { ref, text, done } = useTypewriter<HTMLDivElement>(row.sample, {
    speed: row.role.toLowerCase().startsWith('display') ? 90 : 40,
  });

  const content =
    row.mode === 'typewriter' ? (
      <>
        {text}
        <span className={`case-type-caret ${done ? 'done' : ''}`} aria-hidden />
      </>
    ) : (
      row.sample
    );

  return (
    <div className="case-type-row reveal">
      <div className="case-type-label">
        <span className="role">{row.role}</span>
        <span>{row.family} · {row.weight}</span>
        <span>{row.size}</span>
      </div>
      <div ref={ref} className={`case-type-sample ${sampleClass}`}>
        {content}
      </div>
    </div>
  );
}

function ComponentPreview({ kind }: { kind: ComponentToken['kind'] }) {
  switch (kind) {
    case 'cta-primary':
      return (
        <div className="sample-cta-primary">
          <span aria-hidden>●</span> Chamar no WhatsApp
        </div>
      );
    case 'cta-ghost':
      return <div className="sample-cta-ghost">Ver serviços</div>;
    case 'service-card':
      return (
        <div className="sample-service-card">
          <div className="t">Tela quebrada</div>
          <div className="s">iPhone · a partir de R$ 350</div>
        </div>
      );
    case 'badge':
      return <div className="sample-badge">Apple Specialist</div>;
    case 'nav-link':
      return <span className="sample-nav-link">Serviços</span>;
    default:
      return null;
  }
}

export function CaseStyleGuide({ cs }: Props) {
  return (
    <section className="case-section" id="case-sec-03">
      <div className="case-container">
        <span className="case-section-head">// DESIGN SYSTEM · PROJECT TOKENS</span>

        {/* A — Palette */}
        <span className="case-style-subhead">A · Color Palette</span>
        <div className="case-palette">
          {cs.palette.map((s, i) => (
            <div
              key={s.hex}
              className="case-swatch reveal"
              data-cursor="preview"
              style={{
                ['--reveal-delay' as string]: `${i * 60}ms`,
                ['--swatch-drift' as string]: `${i % 2 === 0 ? -8 : 8}px`,
              } as CSSProperties}
            >
              <div className="case-swatch-fill" style={{ background: s.hex }} />
              <span className="case-swatch-hex">{s.hex}</span>
              <span className="case-swatch-role">{s.role}</span>
            </div>
          ))}
        </div>

        {/* B — Typography */}
        <span className="case-style-subhead">B · Typography</span>
        <div className="case-type-rows">
          {cs.typography.map((row) => (
            <TypeSampleRow key={row.role} row={row} />
          ))}
        </div>

        {/* C — Components */}
        <span className="case-style-subhead">C · Component Tokens</span>
        <div className="case-component-grid">
          {cs.components.map((c, i) => (
            <div
              key={c.label}
              className="case-component-tile reveal"
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` } as CSSProperties}
            >
              <div className="case-component-preview">
                <ComponentPreview kind={c.kind} />
              </div>
              <div className="case-component-label">
                <span className="name">{c.label}</span>
                <span>{c.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* D — Spacing */}
        <span className="case-style-subhead">D · Spacing & Grid</span>
        <div className="case-spacing-diagram reveal">
          <div className="case-spacing-item">
            <span className="k">Base unit</span>
            <span className="v">{cs.spacing.base}</span>
            <div className="viz">
              <div className="case-spacing-viz-dots" />
            </div>
          </div>
          <div className="case-spacing-item">
            <span className="k">Section padding</span>
            <span className="v">{cs.spacing.sectionPadding}</span>
            <div className="viz">
              <div className="case-spacing-viz-line" />
            </div>
          </div>
          <div className="case-spacing-item">
            <span className="k">Content max-width</span>
            <span className="v">{cs.spacing.maxWidth}</span>
            <div className="viz">
              <div className="case-spacing-viz-line" />
            </div>
          </div>
          <div className="case-spacing-item">
            <span className="k">Grid</span>
            <span className="v">{cs.spacing.grid}</span>
            <div className="viz">
              <div className="case-spacing-viz-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
