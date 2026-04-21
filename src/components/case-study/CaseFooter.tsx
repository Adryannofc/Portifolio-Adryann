import { Link } from 'react-router-dom';
import type { CaseStudyContent } from '../../data/projects';

interface Props {
  cs: CaseStudyContent;
}

export function CaseFooter({ cs }: Props) {
  const { prev, next } = cs.nav;

  return (
    <footer className="case-footer" id="case-sec-07">
      <div className="case-container">
        <div className="case-footer-grid">
          {prev ? (
            <Link to={`/work/${prev.slug}`} className="case-footer-nav prev" data-cursor="link">
              <span className="case-footer-nav-dir">
                <span className="arrow">←</span> Previous
              </span>
              <span className="case-footer-nav-n">{prev.n}</span>
              <span className="case-footer-nav-title">{prev.title}</span>
              <span className="case-footer-nav-desc">{prev.desc}</span>
            </Link>
          ) : (
            <div className="case-footer-nav prev disabled" aria-hidden>
              <span className="case-footer-nav-dir">
                <span className="arrow">←</span> Previous
              </span>
              <span className="case-footer-nav-desc">— first case study —</span>
            </div>
          )}

          <Link to="/#work" className="case-footer-back mono" data-cursor="link">
            ↑ Back to all work
          </Link>

          {next ? (
            <Link to={`/work/${next.slug}`} className="case-footer-nav next" data-cursor="link">
              <span className="case-footer-nav-dir">
                Next <span className="arrow">→</span>
              </span>
              <span className="case-footer-nav-n">{next.n}</span>
              <span className="case-footer-nav-title">{next.title}</span>
              <span className="case-footer-nav-desc">{next.desc}</span>
            </Link>
          ) : (
            <div className="case-footer-nav next disabled" aria-hidden>
              <span className="case-footer-nav-dir">
                Next <span className="arrow">→</span>
              </span>
              <span className="case-footer-nav-desc">— last case study —</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
