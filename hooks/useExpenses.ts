'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, Category, ExpenseFilters, SortField, SortOrder } from '@/types/expense';
import { loadExpenses, saveExpenses } from '@/utils/storage';
import { format, isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const DEFAULT_FILTERS: ExpenseFilters = {
  dateFrom: '',
  dateTo: '',
  category: '',
  search: '',
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadExpenses();
    setExpenses(stored);
    setIsLoaded(true);
  }, []);

  // Persist whenever expenses change
  useEffect(() => {
    if (isLoaded) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoaded]);

  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
    return expense;
  }, []);

  const updateExpense = useCallback((id: string, data: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortOrder('desc');
      return field;
    });
  }, []);

  // Filtered + sorted expenses
  const filteredExpenses = expenses
    .filter((e) => {
      if (filters.category && e.category !== filters.category) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !e.description.toLowerCase().includes(q) &&
          !e.category.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.dateFrom) {
        if (e.date < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        if (e.date > filters.dateTo) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  // Analytics helpers
  const totalAllTime = expenses.reduce((s, e) => s + e.amount, 0);

  const now = new Date();
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const thisMonthExpenses = expenses.filter((e) => e.date >= monthStart && e.date <= monthEnd);
  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const spendingByCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory =
    Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Monthly totals for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = format(d, 'yyyy-MM');
    const label = format(d, 'MMM');
    const total = expenses
      .filter((e) => e.date.startsWith(key))
      .reduce((s, e) => s + e.amount, 0);
    return { month: label, total };
  });

  return {
    expenses,
    filteredExpenses,
    filters,
    setFilters,
    sortField,
    sortOrder,
    toggleSort,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoaded,
    analytics: {
      totalAllTime,
      totalThisMonth,
      thisMonthExpenses,
      spendingByCategory,
      topCategory,
      monthlyData,
      totalExpenses: expenses.length,
    },
  };
}
