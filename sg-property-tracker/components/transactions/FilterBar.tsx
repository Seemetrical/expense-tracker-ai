'use client';

import { Search, X } from 'lucide-react';
import { TransactionFilters } from '@/types/property';
import { PROPERTY_TYPES, TENURE_OPTIONS, SALE_TYPE_OPTIONS, DISTRICTS } from '@/constants/filters';

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  total: number;
}

export function FilterBar({ filters, onChange, total }: Props) {
  function set<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange({ search: '', district: '', propertyType: '', tenure: '', typeOfSale: '', dateFrom: '', dateTo: '' });
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Text search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Street or project…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Property type */}
        <select
          value={filters.propertyType}
          onChange={(e) => set('propertyType', e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Tenure */}
        <select
          value={filters.tenure}
          onChange={(e) => set('tenure', e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tenures</option>
          {TENURE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* District */}
        <select
          value={filters.district}
          onChange={(e) => set('district', e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        {/* Sale type */}
        <select
          value={filters.typeOfSale}
          onChange={(e) => set('typeOfSale', e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sale Types</option>
          {SALE_TYPE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-1 text-sm">
          <input
            type="month"
            value={filters.dateFrom}
            onChange={(e) => set('dateFrom', e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <span className="text-gray-400">–</span>
          <input
            type="month"
            value={filters.dateTo}
            onChange={(e) => set('dateTo', e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Result count + clear */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">{total.toLocaleString()} results</span>
          {hasFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
