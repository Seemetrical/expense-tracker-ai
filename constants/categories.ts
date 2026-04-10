import { CategoryConfig } from '@/types/expense';

export const CATEGORIES: string[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Food: {
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    icon: '🍽️',
    chartColor: '#f97316',
  },
  Transportation: {
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    icon: '🚗',
    chartColor: '#3b82f6',
  },
  Entertainment: {
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    icon: '🎬',
    chartColor: '#a855f7',
  },
  Shopping: {
    color: 'text-pink-700',
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    icon: '🛍️',
    chartColor: '#ec4899',
  },
  Bills: {
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    icon: '📄',
    chartColor: '#ef4444',
  },
  Other: {
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    icon: '📦',
    chartColor: '#6b7280',
  },
};

// Color palette for auto-assigning styles to new custom categories
export const CUSTOM_CATEGORY_PALETTE: Array<Omit<CategoryConfig, 'icon'>> = [
  { color: 'text-teal-700', bg: 'bg-teal-100', border: 'border-teal-200', chartColor: '#14b8a6' },
  { color: 'text-cyan-700', bg: 'bg-cyan-100', border: 'border-cyan-200', chartColor: '#06b6d4' },
  { color: 'text-lime-700', bg: 'bg-lime-100', border: 'border-lime-200', chartColor: '#84cc16' },
  { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', chartColor: '#f59e0b' },
  { color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200', chartColor: '#f43f5e' },
  { color: 'text-violet-700', bg: 'bg-violet-100', border: 'border-violet-200', chartColor: '#7c3aed' },
  { color: 'text-sky-700', bg: 'bg-sky-100', border: 'border-sky-200', chartColor: '#0ea5e9' },
  { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', chartColor: '#10b981' },
];

export const FALLBACK_CATEGORY_CONFIG: CategoryConfig = {
  color: 'text-gray-700',
  bg: 'bg-gray-100',
  border: 'border-gray-200',
  icon: '🏷️',
  chartColor: '#6b7280',
};
