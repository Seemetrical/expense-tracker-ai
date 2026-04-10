export type Category = string;

export interface CategoryConfig {
  color: string;
  bg: string;
  border: string;
  icon: string;
  chartColor: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: Category;
  description: string;
  createdAt: string; // ISO timestamp
}

export interface ExpenseFilters {
  dateFrom: string;
  dateTo: string;
  category: Category | '';
  search: string;
}

export type SortField = 'date' | 'amount' | 'category' | 'description';
export type SortOrder = 'asc' | 'desc';
