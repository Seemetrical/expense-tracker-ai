'use client';

import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem } from '@/types/property';
import { WATCHLIST_STORAGE_KEY } from '@/constants/filters';

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((item: WatchlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [{ ...item, syncStatus: 'pending' }, ...prev];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isWatched = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const updateSyncStatus = useCallback(
    (ids: string[], status: WatchlistItem['syncStatus']) => {
      setItems((prev) =>
        prev.map((i) => (ids.includes(i.id) ? { ...i, syncStatus: status } : i)),
      );
    },
    [],
  );

  return { items, add, remove, isWatched, updateSyncStatus };
}
