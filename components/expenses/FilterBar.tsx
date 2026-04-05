'use client';

import { ExpenseFilters } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface Props {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, resultCount }: Props) {
  const [showFilters, setShowFilters] = useState(false);

  function set(field: keyof ExpenseFilters, value: string) {
    onChange({ ...filters, [field]: value });
  }

  function clearAll() {
    onChange({ dateFrom: '', dateTo: '', category: '', search: '' });
  }

  const hasActiveFilters =
    filters.search || filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-3">
      {/* Top row: search + toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors
            ${showFilters || hasActiveFilters
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
              {[filters.category, filters.dateFrom, filters.dateTo].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
              <select
                value={filters.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                max={filters.dateTo || undefined}
                onChange={(e) => set('dateFrom', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">To</label>
              <input
                type="date"
                value={filters.dateTo}
                min={filters.dateFrom || undefined}
                onChange={(e) => set('dateTo', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-gray-500">
        {resultCount} {resultCount === 1 ? 'expense' : 'expenses'} found
        {hasActiveFilters && ' (filtered)'}
      </p>
    </div>
  );
}
