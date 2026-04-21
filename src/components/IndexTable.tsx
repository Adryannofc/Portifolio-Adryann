import { useState, type CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { ARCHIVE } from '../data/projects';
import { SectionHead } from './Header';

type SortKey = 'n' | 'title' | 'year';

export function IndexTable() {
  const ref = useReveal<HTMLElement>();
  const [sort, setSort] = useState<SortKey>('n');
  const sorted = [...ARCHIVE].sort((a, b) => {
    if (sort === 'year') return b.year.localeCompare(a.year);
    if (sort === 'title') return a.title.localeCompare(b.title);
    return a.n.localeCompare(b.n);
  });

  return (
    <section id="index" className="idx" ref={ref} data-screen-label="07 Index">
      <SectionHead
        index="07 /"
        eyebrow="INDEX · EVERYTHING"
        title={
          <>
            <span className="mask-reveal">
              <span>The archive.</span>
            </span>
          </>
        }
        right={
          <div className="idx-sort mono">
            <span>SORT ·</span>
            {(['n', 'title', 'year'] as SortKey[]).map((k) => (
              <button
                key={k}
                className={`idx-sort-btn ${sort === k ? 'on' : ''}`}
                onClick={() => setSort(k)}
                data-cursor="link"
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      <div className="idx-table">
        <div className="idx-thead mono">
          <span>#</span>
          <span>TITLE</span>
          <span>TYPE</span>
          <span>STACK</span>
          <span>YEAR</span>
          <span>STATUS</span>
        </div>
        {sorted.map((r, i) => (
          <a
            href="#"
            className="idx-row reveal"
            key={r.n}
            style={{ ['--reveal-delay' as string]: `${i * 35}ms` } as CSSProperties}
            data-cursor="view"
          >
            <span className="mono idx-n">{r.n}</span>
            <span className="idx-title">{r.title}</span>
            <span className="mono idx-kind">{r.kind}</span>
            <span className="mono idx-stack">{r.stack}</span>
            <span className="mono idx-year">{r.year}</span>
            <span className={`mono idx-status idx-status-${r.status.toLowerCase()}`}>
              <span className="idx-status-dot" />
              {r.status}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
