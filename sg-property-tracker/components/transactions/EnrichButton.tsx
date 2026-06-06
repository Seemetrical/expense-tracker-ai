'use client';

import { Sparkles, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

type State = 'idle' | 'loading' | 'done' | 'error' | 'no-coords';

interface Props {
  state: State;
  onEnrich: () => void;
}

export function EnrichButton({ state, onEnrich }: Props) {
  if (state === 'no-coords') {
    return (
      <span title="No coordinates available" className="text-gray-300">
        <AlertTriangle className="w-4 h-4" />
      </span>
    );
  }

  if (state === 'loading') {
    return <Spinner className="w-4 h-4 text-blue-500" />;
  }

  if (state === 'done') {
    return (
      <span className="text-emerald-500 text-xs font-medium">Enriched</span>
    );
  }

  if (state === 'error') {
    return (
      <button
        onClick={onEnrich}
        title="Retry enrichment"
        className="text-red-400 hover:text-red-600 text-xs"
      >
        Retry
      </button>
    );
  }

  return (
    <button
      onClick={onEnrich}
      title="Get full address"
      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
    >
      <Sparkles className="w-3 h-3" />
      Enrich
    </button>
  );
}
