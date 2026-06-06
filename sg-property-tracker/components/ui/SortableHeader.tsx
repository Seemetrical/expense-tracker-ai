'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { SortField, SortOrder } from '@/types/property';

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField | null;
  currentOrder: SortOrder;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortableHeader({
  field, label, currentField, currentOrder, onSort, className = '',
}: SortableHeaderProps) {
  const active = currentField === field;
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-gray-900 ${className}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          currentOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronsUpDown className="w-3 h-3 opacity-40" />
        )}
      </span>
    </th>
  );
}
