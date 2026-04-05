'use client';

import { useExpenseContext } from '@/app/providers';
import ExpenseList from '@/components/expenses/ExpenseList';
import FilterBar from '@/components/expenses/FilterBar';
import { exportToCSV } from '@/utils/export';
import { formatCurrency } from '@/utils/currency';
import { Download, PlusCircle } from 'lucide-react';

export default function ExpensesPage() {
  const {
    filteredExpenses,
    filters,
    setFilters,
    sortField,
    sortOrder,
    toggleSort,
    openAddModal,
    openEditModal,
    deleteExpense,
    isLoaded,
  } = useExpenseContext();

  const totalFiltered = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          {filteredExpenses.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              Total: <span className="font-semibold text-gray-700">{formatCurrency(totalFiltered)}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredExpenses)}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle size={15} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        resultCount={filteredExpenses.length}
      />

      {/* List */}
      <ExpenseList
        expenses={filteredExpenses}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
        onEdit={openEditModal}
        onDelete={deleteExpense}
      />
    </div>
  );
}
