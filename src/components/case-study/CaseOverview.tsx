import type { CaseStudyContent } from '../../data/projects';
import { useCountUp } from '../../hooks/useCountUp';

interface Props {
  cs: CaseStudyContent;
}

function MetaValue({ raw }: { raw: string }) {
  const match = raw.match(/^(\D*)(\d[\d,.]*)(.*)$/);
  const numStr = match ? match[2].replace(/[^\d]/g, '') : '0';
  const target = parseInt(numStr, 10) || 0;
  const { ref, value } = useCountUp<HTMLSpanElement>(target);
  if (!match || !Number.isFinite(target) || target === 0) return <>{raw}</>;
  return (
    <>
      {match[1]}
      <span ref={ref}>{value}</span>
      {match[3]}
    </>
  );
}

export function CaseOverview({ cs }: Props) {
  const stats: Array<{ label: string; value: string }> = [
    { label: '// PROBLEM', value: cs.overview.problem },
    { label: '// SOLUTION', value: cs.overview.solution },
    { label: '// RESULT', value: cs.overview.result },
  ];

  return (
    <section className="case-section" id="case-sec-02">
      <div className="case-container">
        <span className="case-section-head">// OVERVIEW</span>

        <div className="case-overview-stats reveal">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="case-stat-label">{s.label}</span>
              <p className="case-stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="case-overview-grid">
          <div className="case-brief reveal" data-cursor="read">
            <h3>The Brief</h3>
            {cs.brief.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="case-meta-list reveal">
            {cs.meta.map((row) => (
              <div key={row.k} className="case-meta-list-row">
                <span className="k">{row.k}</span>
                <span className="dots">····························································</span>
                <span className="v">
                  <MetaValue raw={row.v} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
