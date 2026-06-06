'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { Property } from '@/types/property';
import { buildRadar, EnBlocSignal } from '@/utils/enblocSignal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useRadar() {
  // Fetch a large batch for analysis — no filters, max records
  const { data, error, isLoading } = useSWR<{ records: Property[] }>(
    '/api/transactions?limit=1000',
    fetcher,
    { revalidateOnFocus: false },
  );

  const signals = useMemo<EnBlocSignal[]>(() => {
    if (!data?.records?.length) return [];
    return buildRadar(data.records);
  }, [data?.records]);

  const counts = useMemo(() => ({
    alert: signals.filter((s) => s.level === 'alert').length,
    elevated: signals.filter((s) => s.level === 'elevated').length,
    watch: signals.filter((s) => s.level === 'watch').length,
    normal: signals.filter((s) => s.level === 'normal').length,
    total: signals.length,
  }), [signals]);

  return { signals, counts, isLoading, error };
}
