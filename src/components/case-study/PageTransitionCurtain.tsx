import { useEffect, useState } from 'react';

export function PageTransitionCurtain() {
  const [phase, setPhase] = useState<'enter' | 'idle'>('enter');

  useEffect(() => {
    const t = window.setTimeout(() => setPhase('idle'), 600);
    return () => window.clearTimeout(t);
  }, []);

  if (phase === 'idle') return null;

  return <div className="case-curtain" aria-hidden data-phase={phase} />;
}
