import { useState } from 'react';
import type { CaseStudyContent, ImplNote } from '../../data/projects';
import { useParallax } from '../../hooks/useParallax';

interface Props {
  cs: CaseStudyContent;
}

function NoteItem({
  note,
  isOpen,
  onToggle,
}: {
  note: ImplNote;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const paragraphs = note.body.split('\n\n');
  const bodyId = `case-note-body-${note.n}`;

  return (
    <div className={`case-accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="case-accordion-head"
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={onToggle}
        data-cursor="read"
      >
        <span className="n">{note.n}</span>
        <span className="t">{note.title}</span>
        <span className="toggle" aria-hidden>+</span>
      </button>
      <div
        id={bodyId}
        className={`case-accordion-body ${isOpen ? 'open' : ''}`}
        role="region"
        aria-hidden={!isOpen}
      >
        <div className="case-accordion-body-inner">
          <div className="case-accordion-body-inner-p">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseNotes({ cs }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const noiseRef = useParallax<HTMLDivElement>({ speed: 0.08 });

  return (
    <section className="case-section case-notes-section" id="case-sec-05">
      <div className="case-notes-noise" aria-hidden ref={noiseRef} />
      <div className="case-container">
        <span className="case-section-head">// ENGINEERING · DECISIONS</span>

        <div className="case-accordion reveal">
          {cs.notes.map((note, i) => (
            <NoteItem
              key={note.n}
              note={note}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
