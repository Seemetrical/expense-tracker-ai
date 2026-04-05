'use client';

import { useExpenseContext } from './providers';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryChart from '@/components/dashboard/CategoryChart';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatCurrency } from '@/utils/currency';
import { format, parseISO } from 'date-fns';
import { PlusCircle, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/types/expense';
import { exportToCSV } from '@/utils/export';

export default function DashboardPage() {
  const { analytics, expenses, openAddModal, isLoaded } = useExpenseContext();
  const recentExpenses = expenses.slice(0, 5);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(expenses)}
            disabled={expenses.length === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards
        totalAllTime={analytics.totalAllTime}
        totalThisMonth={analytics.totalThisMonth}
        topCategory={analytics.topCategory}
        totalExpenses={analytics.totalExpenses}
      />

      {expenses.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="text-5xl mb-4">💰</div>
          <h2 className="text-xl font-semibold text-gray-900">Start tracking your expenses</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Add your first expense to see insights, charts, and spending patterns here.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={16} />
            Add First Expense
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Monthly chart — wider */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Monthly Spending</h2>
            <MonthlyChart data={analytics.monthlyData} />
          </div>

          {/* Category breakdown */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">By Category</h2>
            <CategoryChart spendingByCategory={analytics.spendingByCategory} />
          </div>

          {/* Recent expenses */}
          <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Expenses</h2>
              <Link
                href="/expenses"
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <CategoryBadge category={expense.category} size="sm" />
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
