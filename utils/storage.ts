import { Expense, CategoryConfig } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-expenses';
const CATEGORIES_STORAGE_KEY = 'expense-tracker-custom-categories';

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export interface CustomCategory {
  name: string;
  config: CategoryConfig;
}

export function loadCustomCategories(): CustomCategory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: CustomCategory[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}
