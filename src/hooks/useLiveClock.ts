import { useEffect, useState } from 'react';

export function useLiveClock(tz = 'America/Sao_Paulo') {
  const [t, setT] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (d: Date) => {
    try {
      return d.toLocaleTimeString('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return d.toTimeString().slice(0, 8);
    }
  };
  return fmt(t);
}
