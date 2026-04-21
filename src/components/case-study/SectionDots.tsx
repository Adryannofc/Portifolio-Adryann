import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'case-sec-01', label: 'Header' },
  { id: 'case-sec-02', label: 'Overview' },
  { id: 'case-sec-03', label: 'Style Guide' },
  { id: 'case-sec-04', label: 'Stack' },
  { id: 'case-sec-05', label: 'Notes' },
  { id: 'case-sec-06', label: 'Roadmap' },
  { id: 'case-sec-07', label: 'Navigation' },
];

export function SectionDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    if (els.some((el) => !el)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -40% 0px' },
    );

    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="case-dots" aria-label="Sections">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className={`case-dot ${active === i ? 'active' : ''}`}
          onClick={() => go(s.id)}
          aria-label={`Go to ${s.label}`}
          aria-current={active === i ? 'true' : undefined}
          data-cursor="link"
        >
          <span className="case-dot-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
