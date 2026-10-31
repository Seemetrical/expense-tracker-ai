'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useExpenseContext } from '@/app/providers';
import { useBudget } from '@/hooks/useBudget';
import { formatCurrency } from '@/utils/currency';
import { format, startOfMonth, endOfMonth, differenceInCalendarDays } from 'date-fns';
import { Edit2, Check, X, Calendar, AlertTriangle } from 'lucide-react';

const PieChart = dynamic(() => import('recharts').then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((m) => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);

const RADIAN = Math.PI / 180;

import type { PieLabelRenderProps } from 'recharts';

function renderSliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) {
  if (cx == null || cy == null || midAngle == null || innerRadius == null || outerRadius == null || percent == null || percent < 0.05) return null;
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + r * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AnalyticsPage() {
  const { expenses, isLoaded: expensesLoaded, getCategoryConfig } = useExpenseContext();
  const { budget, setBudget, isLoaded: budgetLoaded } = useBudget();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const now = new Date();
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const daysLeft = differenceInCalendarDays(endOfMonth(now), now);
  const monthName = format(now, 'MMMM yyyy');

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date >= monthStart && e.date <= monthEnd),
    [expenses, monthStart, monthEnd]
  );

  const totalSpent = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses]
  );

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExpenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  const budgetPct = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const budgetRemaining = budget !== null ? budget - totalSpent : null;
  const isOverBudget = budgetRemaining !== null && budgetRemaining < 0;

  function handleEditStart() {
    setInputValue(budget ? String(budget) : '');
    setEditing(true);
  }

  function handleSave() {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      setEditing(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    setInputValue('');
  }

  if (!expensesLoaded || !budgetLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Analytics</h1>
        <p className="mt-0.5 text-sm text-gray-500">{monthName}</p>
      </div>

      {/* Budget tracker */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Budget Tracker</h2>
          <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <Calendar size={12} />
            {daysLeft === 0
              ? 'Resets today'
              : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} to reset`}
          </div>
        </div>

        {/* Edit input */}
        {editing && (
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Monthly budget ($)</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="w-36 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. 2000"
              autoFocus
              min="1"
            />
            <button
              onClick={handleSave}
              className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-700 transition-colors"
            >
              <Check size={15} />
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* No budget set */}
        {!budget && !editing && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-gray-500">
              Set a monthly budget to track your remaining spend and get overage alerts.
            </p>
            <button
              onClick={handleEditStart}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Set Budget
            </button>
          </div>
        )}

        {/* Budget set — show metrics */}
        {budget && !editing && (
          <>
            <div className="mb-5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Spent</p>
                <p className={`mt-1 text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Budget</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(budget)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {isOverBudget ? 'Over by' : 'Remaining'}
                </p>
                <p className={`mt-1 text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatCurrency(Math.abs(budgetRemaining!))}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">{budgetPct.toFixed(0)}% of budget used</span>
                {isOverBudget && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertTriangle size={12} />
                    Over budget
                  </span>
                )}
                {!isOverBudget && budgetPct >= 80 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <AlertTriangle size={12} />
                    Nearing limit
                  </span>
                )}
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-red-500'
                      : budgetPct >= 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleEditStart}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Edit2 size={11} />
              Edit budget
            </button>
          </>
        )}
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-900">Spending by Category</h2>

        {categoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-sm font-medium text-gray-600">No expenses this month</p>
            <p className="mt-1 text-xs text-gray-400">Add expenses to see your category breakdown.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Pie chart */}
            <div className="h-64 w-full shrink-0 lg:w-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    labelLine={false}
                    label={renderSliceLabel}
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={getCategoryConfig(entry.name).chartColor}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Spent']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend table */}
            <div className="flex-1 divide-y divide-gray-50">
              <div className="flex items-center gap-3 pb-2">
                <div className="w-3 shrink-0" />
                <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Category</span>
                <span className="w-12 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">%</span>
                <span className="w-24 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</span>
              </div>

              {categoryData.map(({ name, value }) => {
                const config = getCategoryConfig(name);
                const pct = totalSpent > 0 ? (value / totalSpent) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3 py-3">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: config.chartColor }}
                    />
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <span>{config.icon}</span>
                      <span className="truncate text-sm font-medium text-gray-800">{name}</span>
                    </div>
                    <span className="w-12 text-right text-sm text-gray-500">{pct.toFixed(1)}%</span>
                    <span className="w-24 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(value)}
                    </span>
                  </div>
                );
              })}

              {/* Total row */}
              <div className="flex items-center gap-3 pt-3">
                <div className="w-3 shrink-0" />
                <span className="flex-1 text-sm font-bold text-gray-900">Total</span>
                <span className="w-12 text-right text-sm font-semibold text-gray-500">100%</span>
                <span className="w-24 text-right text-sm font-bold text-gray-900">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
