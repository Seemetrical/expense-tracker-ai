'use client';

import { useState, useCallback } from 'react';
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  CUSTOM_CATEGORY_PALETTE,
  FALLBACK_CATEGORY_CONFIG,
} from '@/constants/categories';
import { CategoryConfig } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-custom-categories';

function loadCustomCategories(): Record<string, CategoryConfig> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useCategories() {
  const [customConfig, setCustomConfig] = useState<Record<string, CategoryConfig>>(loadCustomCategories);

  const categoryConfig: Record<string, CategoryConfig> = { ...CATEGORY_CONFIG, ...customConfig };

  const allCategories: string[] = [...CATEGORIES, ...Object.keys(customConfig)];

  const getCategoryConfig = useCallback(
    (name: string): CategoryConfig => categoryConfig[name] ?? FALLBACK_CATEGORY_CONFIG,
    [categoryConfig]
  );

  const addCategory = useCallback(
    (name: string): boolean => {
      const trimmed = name.trim();
      if (!trimmed || allCategories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
        return false;
      }

      const paletteIndex = Object.keys(customConfig).length % CUSTOM_CATEGORY_PALETTE.length;
      const palette = CUSTOM_CATEGORY_PALETTE[paletteIndex];

      const config: CategoryConfig = { ...palette, icon: '🏷️' };

      const updated = { ...customConfig, [trimmed]: config };
      setCustomConfig(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return true;
    },
    [allCategories, customConfig]
  );

  return { allCategories, categoryConfig, getCategoryConfig, addCategory };
}
