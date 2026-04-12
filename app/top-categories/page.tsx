'use client';

import { useExpenseContext } from '@/app/providers';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatCurrency } from '@/utils/currency';

export default function TopCategoriesPage() {
  const { analytics, isLoaded } = useExpenseContext();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const { spendingByCategory, totalAllTime } = analytics;

  const ranked = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1]);

  const isEmpty = ranked.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Categories</h1>
        <p className="mt-0.5 text-sm text-gray-500">Spending breakdown by category, all time</p>
      </div>

      {/* Summary card */}
      {!isEmpty && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Categories Used</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{ranked.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Spending</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalAllTime)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-1 col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Top Category</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{ranked[0]?.[0] ?? '—'}</p>
          </div>
        </div>
      )}

      {/* Ranked list */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-4xl">📊</p>
          <p className="mt-3 font-semibold text-gray-700">No expenses yet</p>
          <p className="mt-1 text-sm text-gray-500">Add some expenses to see your top categories.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {ranked.map(([category, amount], index) => {
              const pct = totalAllTime > 0 ? (amount / totalAllTime) * 100 : 0;
              return (
                <div key={category} className="flex items-center gap-4 px-5 py-4">
                  {/* Rank */}
                  <span className="w-7 flex-shrink-0 text-center text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>

                  {/* Category badge */}
                  <div className="w-36 flex-shrink-0">
                    <CategoryBadge category={category} size="sm" />
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
                    {formatCurrency(amount)}
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
