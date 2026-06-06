'use client';

import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem, SyncResponse } from '@/types/property';
import { SHEET_ID_STORAGE_KEY } from '@/constants/filters';

export function useSheets() {
  const [connected, setConnected] = useState(false);
  const [sheetId, setSheetIdState] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SHEET_ID_STORAGE_KEY) ?? '';
    setSheetIdState(stored);
  }, []);

  useEffect(() => {
    fetch('/api/sheets/sync')
      .then((r) => r.json())
      .then((d) => setConnected(d.connected))
      .catch(() => setConnected(false));
  }, []);

  const setSheetId = useCallback((id: string) => {
    setSheetIdState(id);
    localStorage.setItem(SHEET_ID_STORAGE_KEY, id);
  }, []);

  const disconnect = useCallback(async () => {
    await fetch('/api/sheets/sync', { method: 'DELETE' });
    setConnected(false);
  }, []);

  const syncItems = useCallback(
    async (items: WatchlistItem[]): Promise<SyncResponse | null> => {
      if (!sheetId) {
        setLastError('No Sheet ID configured');
        return null;
      }
      setSyncing(true);
      setLastError(null);
      try {
        const res = await fetch('/api/sheets/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sheetId, items }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? 'Sync failed');
        }
        return await res.json();
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Sync failed');
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [sheetId],
  );

  return { connected, sheetId, setSheetId, disconnect, syncing, lastError, syncItems };
}
