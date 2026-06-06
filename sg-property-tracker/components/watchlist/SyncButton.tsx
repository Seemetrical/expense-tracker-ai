'use client';

import { RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  connected: boolean;
  sheetId: string;
  syncing: boolean;
  itemCount: number;
  onSync: () => void;
}

export function SyncButton({ connected, sheetId, syncing, itemCount, onSync }: Props) {
  const disabled = !connected || !sheetId || syncing || itemCount === 0;

  let title = 'Sync to Google Sheets';
  if (!connected) title = 'Connect Google account in Settings first';
  else if (!sheetId) title = 'Set Sheet ID in Settings first';
  else if (itemCount === 0) title = 'No items to sync';

  return (
    <button
      onClick={onSync}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      {syncing ? (
        <Spinner className="w-4 h-4" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {syncing ? 'Syncing…' : `Sync ${itemCount} to Sheets`}
    </button>
  );
}
