import { useState, type CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { getArchive } from '../data/projects';
import { SectionHead } from './Header';
import { useI18n } from '../contexts/I18nContext';

type SortKey = 'n' | 'title' | 'year';

export function IndexTable() {
  const { locale, t } = useI18n();
  const ref = useReveal<HTMLElement>();
  const [sort, setSort] = useState<SortKey>('n');
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...getArchive(locale)].sort((a, b) => {
    if (sort === 'year') return b.year.localeCompare(a.year);
    if (sort === 'title') return a.title.localeCompare(b.title);
    return a.n.localeCompare(b.n);
  });

  const toggleExpanded = (n: string) =>
    setExpanded((prev) => (prev === n ? null : n));

  return (
    <section id="index" className="idx" ref={ref} data-screen-label="08 Index">
      <SectionHead
        index="08 /"
        eyebrow={t.index.eyebrow}
        title={
          <>
            <span className="mask-reveal">
              <span>{t.index.title}</span>
            </span>
          </>
        }
        right={
          <div className="idx-sort mono">
            <span>{t.index.sort}</span>
            {/* Desktop: individual buttons */}
            <span className="idx-sort-btns">
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
            </span>
            {/* Mobile: select dropdown */}
            <select
              className="idx-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort by"
            >
              <option value="n">N</option>
              <option value="title">TITLE</option>
              <option value="year">YEAR</option>
            </select>
          </div>
        }
      />

      <div className="idx-table">
        <div className="idx-thead mono">
          <span>#</span>
          <span>{t.index.cols.title}</span>
          <span>{t.index.cols.type}</span>
          <span>{t.index.cols.stack}</span>
          <span>{t.index.cols.year}</span>
          <span>{t.index.cols.status}</span>
          {/* Spacer for expand icon column on mobile */}
          <span aria-hidden />
        </div>
        {sorted.map((r, i) => {
          const isExpanded = expanded === r.n;
          return (
            <div
              key={r.n}
              className={`idx-row-wrap${isExpanded ? ' expanded' : ''}`}
            >
              <div
                className="idx-row reveal"
                style={{ ['--reveal-delay' as string]: `${i * 35}ms` } as CSSProperties}
                data-cursor="view"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleExpanded(r.n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpanded(r.n);
                  }
                }}
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
                <span className="idx-expand-icon" aria-hidden>›</span>
              </div>
              {/* Accordion sub-row: visible on mobile when expanded */}
              <div className="idx-row-detail" aria-hidden={!isExpanded}>
                <div>
                  <div className="idx-detail-label">{t.index.expand.type}</div>
                  <span className="mono">{r.kind}</span>
                </div>
                <div>
                  <div className="idx-detail-label">{t.index.expand.year}</div>
                  <span className="mono">{r.year}</span>
                </div>
                <div>
                  <div className="idx-detail-label">{t.index.expand.stack}</div>
                  <span className="mono">{r.stack}</span>
                </div>
                <div>
                  <div className="idx-detail-label">{t.index.expand.status}</div>
                  <span className={`mono idx-status idx-status-${r.status.toLowerCase()}`}>
                    <span className="idx-status-dot" />
                    {r.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
