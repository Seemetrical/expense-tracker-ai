import { Category } from '@/types/expense';
import { CATEGORY_CONFIG } from '@/constants/categories';

interface Props {
  category: Category;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const config = CATEGORY_CONFIG[category];
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
