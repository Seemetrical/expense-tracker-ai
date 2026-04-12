'use client';

import { useMemo } from 'react';
import { useExpenseContext } from '@/app/providers';
import { formatCurrency } from '@/utils/currency';

interface VendorRow {
  name: string;
  total: number;
  count: number;
}

export default function TopVendorsPage() {
  const { expenses, analytics, isLoaded } = useExpenseContext();

  const ranked: VendorRow[] = useMemo(() => {
    const map = new Map<string, VendorRow>();
    for (const e of expenses) {
      const key = e.description.trim().toLowerCase();
      if (!key) continue;
      const display = e.description.trim();
      const existing = map.get(key);
      if (existing) {
        existing.total += e.amount;
        existing.count += 1;
      } else {
        map.set(key, { name: display, total: e.amount, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 20);
  }, [expenses]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const { totalAllTime } = analytics;
  const isEmpty = ranked.length === 0;
  const uniqueCount = ranked.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Vendors</h1>
        <p className="mt-0.5 text-sm text-gray-500">Your most-spent vendors, all time (top 20)</p>
      </div>

      {/* Summary cards */}
      {!isEmpty && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Unique Vendors</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{uniqueCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Spending</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalAllTime)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-1 col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Top Vendor</p>
            <p className="mt-1 text-lg font-bold text-gray-900 truncate">{ranked[0]?.name ?? '—'}</p>
          </div>
        </div>
      )}

      {/* Ranked list */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-4xl">🏪</p>
          <p className="mt-3 font-semibold text-gray-700">No expenses yet</p>
          <p className="mt-1 text-sm text-gray-500">Add some expenses to see your top vendors.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {ranked.map((vendor, index) => {
              const pct = totalAllTime > 0 ? (vendor.total / totalAllTime) * 100 : 0;
              return (
                <div key={vendor.name} className="flex items-center gap-4 px-5 py-4">
                  {/* Rank */}
                  <span className="w-7 flex-shrink-0 text-center text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>

                  {/* Vendor name + transaction count */}
                  <div className="w-40 flex-shrink-0 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-500">
                      {vendor.count} {vendor.count === 1 ? 'transaction' : 'transactions'}
                    </p>
                  </div>

                  {/* Bar + percentage */}
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 flex-shrink-0 text-right text-xs font-medium text-gray-500">
                      {pct.toFixed(1)}%
                    </span>
                  </div>

                  {/* Amount */}
                  <span className="w-24 flex-shrink-0 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(vendor.total)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
