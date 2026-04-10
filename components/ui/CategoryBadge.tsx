'use client';

import { useExpenseContext } from '@/app/providers';

interface Props {
  category: string;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const { getCategoryConfig } = useExpenseContext();
  const config = getCategoryConfig(category);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium
        ${config.bg} ${config.color} ${config.border}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      <span>{config.icon}</span>
      {category}
    </span>
  );
}
