'use client';

import { Expense, SortField, SortOrder } from '@/types/expense';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatCurrency } from '@/utils/currency';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Props {
  expenses: Expense[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { field: SortField; label: string; className?: string }[] = [
  { field: 'date', label: 'Date', className: 'w-28' },
  { field: 'description', label: 'Description' },
  { field: 'category', label: 'Category', className: 'w-40' },
  { field: 'amount', label: 'Amount', className: 'w-28 text-right' },
];

function SortIcon({ field, sortField, sortOrder }: { field: SortField; sortField: SortField; sortOrder: SortOrder }) {
  if (field !== sortField) return <ChevronsUpDown size={13} className="text-gray-300" />;
  return sortOrder === 'asc'
    ? <ChevronUp size={13} className="text-indigo-500" />
    : <ChevronDown size={13} className="text-indigo-500" />;
}

export default function ExpenseList({
  expenses,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
        <div className="text-4xl mb-3">💸</div>
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new expense</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map(({ field, label, className }) => (
                <th
                  key={field}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${className ?? ''}`}
                >
                  <button
                    onClick={() => onSort(field)}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    {label}
                    <SortIcon field={field} sortField={sortField} sortOrder={sortOrder} />
                  </button>
                </th>
              ))}
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {expenses.map((expense) => (
              <tr key={expense.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {format(parseISO(expense.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-900 font-medium max-w-xs truncate">
                  {expense.description}
                </td>
                <td className="px-4 py-3.5">
                  <CategoryBadge category={expense.category} size="sm" />
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(parseISO(expense.date), 'MMM d, yyyy')}
                </p>
              </div>
              <span className="text-base font-bold text-gray-900 shrink-0">
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <CategoryBadge category={expense.category} size="sm" />
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
