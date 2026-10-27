import { useEffect, useState } from 'react';

/** Today, refreshed hourly so a tab left open rolls over at midnight. */
export function useToday() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 3_600_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
