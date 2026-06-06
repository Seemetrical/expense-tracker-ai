'use client';

import { useState, useCallback } from 'react';
import { EnrichResponse } from '@/types/property';

type EnrichState = 'idle' | 'loading' | 'done' | 'error' | 'no-coords';

export function useEnrich() {
  const [states, setStates] = useState<Record<string, EnrichState>>({});
  const [results, setResults] = useState<Record<string, EnrichResponse>>({});

  const enrich = useCallback(async (id: string, x: string, y: string) => {
    if (!x || !y) {
      setStates((prev) => ({ ...prev, [id]: 'no-coords' }));
      return null;
    }

    setStates((prev) => ({ ...prev, [id]: 'loading' }));

    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const data: EnrichResponse = await res.json();
      setResults((prev) => ({ ...prev, [id]: data }));
      setStates((prev) => ({ ...prev, [id]: 'done' }));
      return data;
    } catch {
      setStates((prev) => ({ ...prev, [id]: 'error' }));
      return null;
    }
  }, []);

  return { states, results, enrich };
}
