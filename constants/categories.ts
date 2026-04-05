import { Category } from '@/types/expense';

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_CONFIG: Record<
  Category,
  { color: string; bg: string; border: string; icon: string; chartColor: string }
> = {
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
