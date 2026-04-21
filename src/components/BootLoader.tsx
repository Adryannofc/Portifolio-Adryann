import { useEffect, useMemo, useState } from 'react';

interface BootLine {
  k: string;
  v: string;
  dur: number;
}

type Phase = 'running' | 'curtain' | 'done';

interface BootLoaderProps {
  onDone?: () => void;
}

export function BootLoader({ onDone }: BootLoaderProps) {
  const lines = useMemo<BootLine[]>(
    () => [
      { k: 'TYPOGRAPHY', v: 'Plus Jakarta · JetBrains Mono', dur: 140 },
      { k: 'GRID',       v: '12col · 24 gutter · 1440 max', dur: 120 },
      { k: 'TOKENS',     v: 'warm · ink · amber · dual surfaces', dur: 160 },
      { k: 'MOTION',     v: 'cubic-bezier(0.16, 1, 0.3, 1)', dur: 140 },
      { k: 'A11Y',       v: 'WCAG AA · reduced-motion guarded', dur: 140 },
      { k: 'ASSETS',     v: '05 cases · preloaded', dur: 150 },
      { k: 'CURSOR',     v: 'contextual · magnetic · trailing', dur: 120 },
      { k: 'SCROLL',     v: 'observer · sticky · horizontal rail', dur: 160 },
    ],
    [],
  );

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('running');
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (step >= lines.length) return;
    const id = setTimeout(() => setStep((s) => s + 1), lines[step].dur);
    return () => clearTimeout(id);
  }, [step, lines]);

  useEffect(() => {
    if (phase !== 'running') return;
    let raf = 0;
    const start = performance.now();
    const total = lines.reduce((a, l) => a + l.dur, 0) + 220;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setPct(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase('curtain'), 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, lines]);

  useEffect(() => {
    if (phase !== 'curtain') return;
    const t = setTimeout(() => {
      setPhase('done');
      onDone?.();
    }, 900);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  if (phase === 'done') return null;

  const curtainUp = phase === 'curtain';
  const now = new Date();
  const ts = now.toISOString().slice(11, 19);

  return (
    <div className="boot" aria-hidden={phase !== 'running'} data-phase={phase}>
      <div
        className="boot-inner"
        style={{ transform: curtainUp ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div className="boot-head">
          <span className="mono">ADRYANN.FELIX · SYSTEM BOOT · v2.6</span>
          <span className="mono">{ts} UTC</span>
        </div>

        <div className="boot-body">
          <div className="boot-title">
            <span className="mono" style={{ color: 'var(--amber)' }}>
              &gt;
            </span>{' '}
            initializing portfolio<span className="boot-cursor">_</span>
          </div>

          <div className="boot-list">
            {lines.map((l, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={l.k}
                  className={`boot-row ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                >
                  <span className="boot-k mono">&gt; {l.k.padEnd(11, ' ')}</span>
                  <span className="boot-dots mono">{'.'.repeat(26)}</span>
                  <span className="boot-v mono">{l.v}</span>
                  <span className="boot-s mono">
                    {done ? '[ OK ]' : active ? '[ … ]' : '[    ]'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="boot-foot">
          <div className="boot-bar">
            <div className="boot-bar-fill" style={{ width: `${Math.round(pct * 100)}%` }} />
          </div>
          <div className="boot-meta">
            <span className="mono">READY IN {(1.2 - pct * 1.2).toFixed(2)}s</span>
            <span className="mono">{Math.round(pct * 100)}%</span>
            <span className="mono">PRESS ↵ TO ENTER</span>
          </div>
        </div>
      </div>

      <div
        className="boot-curtain"
        style={{ transform: curtainUp ? 'translateY(-100%)' : 'translateY(0)' }}
      />
    </div>
  );
}
