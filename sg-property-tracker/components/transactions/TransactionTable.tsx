'use client';

import { Property, SortField, SortOrder, WatchlistItem, EnrichResponse } from '@/types/property';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { TransactionRow } from './TransactionRow';
import { Spinner } from '@/components/ui/Spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE } from '@/constants/filters';

interface Props {
  records: Property[];
  total: number;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  isLoading: boolean;
  sortField: SortField | null;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  enrichStates: Record<string, 'idle' | 'loading' | 'done' | 'error' | 'no-coords'>;
  enrichResults: Record<string, EnrichResponse>;
  onEnrich: (id: string, x: string, y: string) => void;
  onAddWatchlist: (item: WatchlistItem) => void;
  isWatched: (id: string) => boolean;
}

export function TransactionTable({
  records, total, totalPages, page, setPage, isLoading,
  sortField, sortOrder, onSort,
  enrichStates, enrichResults, onEnrich, onAddWatchlist, isWatched,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-6 h-6 text-blue-500" />
        <span className="ml-2 text-sm text-gray-500">Loading transactions…</span>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="text-center py-24 text-gray-400 text-sm">No transactions match your filters.</div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Street / Address</th>
              <SortableHeader field="propertyType" label="Type" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortableHeader field="contractDate" label="Date" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortableHeader field="price" label="Price" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortableHeader field="area" label="Area" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortableHeader field="psf" label="PSF" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenure</th>
              <SortableHeader field="district" label="District" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Save</th>
            </tr>
          </thead>
          <tbody>
            {records.map((p) => (
              <TransactionRow
                key={p.id}
                property={p}
                enrichState={enrichStates[p.id] ?? 'idle'}
                enrichResult={enrichResults[p.id]}
                onEnrich={() => onEnrich(p.id, p.x, p.y)}
                onAddWatchlist={onAddWatchlist}
                isWatched={isWatched(p.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
        <span>
          {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
