'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { useSheets } from '@/hooks/useSheets';
import { useToast } from '@/app/providers';
import { WatchlistTable } from '@/components/watchlist/WatchlistTable';
import { SyncButton } from '@/components/watchlist/SyncButton';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function WatchlistPage() {
  const { items, remove, updateSyncStatus } = useWatchlist();
  const { connected, sheetId, syncing, lastError, syncItems } = useSheets();
  const { addToast } = useToast();

  async function handleSync() {
    const pendingItems = items.filter((i) => i.syncStatus !== 'synced');
    if (!pendingItems.length) {
      addToast('All items already synced', 'info');
      return;
    }

    const ids = pendingItems.map((i) => i.id);
    updateSyncStatus(ids, 'pending');

    const result = await syncItems(pendingItems);
    if (result) {
      updateSyncStatus(ids, 'synced');
      addToast(`${result.appended} ${result.appended === 1 ? 'row' : 'rows'} synced to Google Sheets`, 'success');
    } else {
      updateSyncStatus(ids, 'error');
      addToast(lastError ?? 'Sync failed', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Watchlist</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} saved {items.length === 1 ? 'property' : 'properties'}</p>
        </div>
        <div className="flex items-center gap-3">
          {!connected && (
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <Settings className="w-3 h-3" />
              Connect Sheets
            </Link>
          )}
          <SyncButton
            connected={connected}
            sheetId={sheetId}
            syncing={syncing}
            itemCount={items.filter((i) => i.syncStatus !== 'synced').length}
            onSync={handleSync}
          />
        </div>
      </div>

      {lastError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {lastError}
        </div>
      )}

      <WatchlistTable items={items} onRemove={remove} />
    </div>
  );
}
