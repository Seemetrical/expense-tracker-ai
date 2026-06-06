'use client';

import { useState } from 'react';
import { TransactionFilters, WatchlistItem } from '@/types/property';
import { FilterBar } from '@/components/transactions/FilterBar';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useEnrich } from '@/hooks/useEnrich';
import { useToast } from '@/app/providers';

const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  district: '',
  propertyType: '',
  tenure: '',
  typeOfSale: '',
  dateFrom: '',
  dateTo: '',
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const { records, total, totalPages, page, setPage, isLoading, error, sortField, sortOrder, handleSort } =
    useTransactions(filters);
  const { add, isWatched } = useWatchlist();
  const { states: enrichStates, results: enrichResults, enrich } = useEnrich();
  const { addToast } = useToast();

  function handleAddWatchlist(item: WatchlistItem) {
    add(item);
    addToast(`${item.street} added to watchlist`, 'success');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Landed Property Transactions</h1>
        <p className="text-xs text-gray-400">Source: URA via data.gov.sg · Updated Tue & Fri</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Failed to load transactions. {error.message ?? 'Please try again.'}
        </div>
      )}

      <FilterBar filters={filters} onChange={setFilters} total={total} />

      <TransactionTable
        records={records}
        total={total}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        enrichStates={enrichStates}
        enrichResults={enrichResults}
        onEnrich={enrich}
        onAddWatchlist={handleAddWatchlist}
        isWatched={isWatched}
      />
    </div>
  );
}
