import { formatCurrency } from '@/utils/currency';
import { CategoryConfig } from '@/types/expense';
import { DollarSign, Calendar, Tag, Receipt } from 'lucide-react';

interface Props {
  totalAllTime: number;
  totalThisMonth: number;
  topCategory: string | null;
  totalExpenses: number;
  getCategoryConfig: (name: string) => CategoryConfig;
}

export default function SummaryCards({
  totalAllTime,
  totalThisMonth,
  topCategory,
  totalExpenses,
  getCategoryConfig,
}: Props) {
  const cards = [
    {
      label: 'Total Spending',
      value: formatCurrency(totalAllTime),
      sub: 'All time',
      icon: DollarSign,
      color: 'bg-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
    },
    {
      label: 'This Month',
      value: formatCurrency(totalThisMonth),
      sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      icon: Calendar,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    {
      label: 'Top Category',
      value: topCategory ?? '—',
      sub: topCategory
        ? formatCurrency(0) // filled below
        : 'No expenses yet',
      icon: Tag,
      color: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      isCategory: true,
    },
    {
      label: 'Total Entries',
      value: totalExpenses.toString(),
      sub: totalExpenses === 1 ? 'expense logged' : 'expenses logged',
      icon: Receipt,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, bg, text, isCategory }) => (
        <div
          key={label}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
            <Icon size={18} className={text} />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 truncate">
            {isCategory && value !== '—' && getCategoryConfig(value).icon}{' '}
            {value}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
        </div>
      ))}
    </div>
  );
}
