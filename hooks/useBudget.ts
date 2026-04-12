'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'expense-tracker-budget';

export function useBudget() {
  const [budget, setBudgetState] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed > 0) setBudgetState(parsed);
    }
    setIsLoaded(true);
  }, []);

  function setBudget(amount: number) {
    setBudgetState(amount);
    localStorage.setItem(STORAGE_KEY, String(amount));
  }

  function clearBudget() {
    setBudgetState(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { budget, setBudget, clearBudget, isLoaded };
}
