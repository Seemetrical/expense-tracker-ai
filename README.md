# Expensify — Personal Expense Tracker

A personal finance tracker built with Next.js, Tailwind CSS, and Recharts. Track expenses, visualise spending by category, manage a monthly budget, and identify your top vendors.

## Features

- **Dashboard** — summary cards, 6-month bar chart, category pie chart, recent expenses
- **Expense table** — filterable and sortable list with CSV export
- **Monthly Analytics** — current-month pie chart with % labels on slices, monthly budget tracker with progress bar and days-to-reset countdown
- **Top Categories** — all-time ranked breakdown of spending by category
- **Top Vendors** — top 20 vendors by total spend, derived from expense descriptions

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

Other commands:

```bash
npm run build     # Production build
npm run lint      # ESLint
npx tsc --noEmit  # Type-check without building
```

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts (loaded client-side via `dynamic()`) |
| Icons | Lucide React |
| Date handling | date-fns |
| Persistence | localStorage |

## Project Structure

```
app/
  page.tsx               # Dashboard (/)
  expenses/page.tsx      # Expense table (/expenses)
  analytics/page.tsx     # Monthly analytics (/analytics)
  top-categories/page.tsx  # Top categories (/top-categories)
  top-vendors/page.tsx   # Top vendors (/top-vendors)
  providers.tsx          # Global state + context
  layout.tsx             # Root layout

components/
  dashboard/             # SummaryCards, CategoryChart, MonthlyChart
  expenses/              # ExpenseList, ExpenseForm, FilterBar
  layout/                # Navbar
  ui/                    # CategoryBadge, Modal, Toast

hooks/
  useExpenses.ts         # Central data layer (CRUD, filtering, analytics)
  useCategories.ts       # Category management with custom category support
  useBudget.ts           # Monthly budget persistence

constants/
  categories.ts          # Category colours, icons, chart hex codes

types/
  expense.ts             # Expense, ExpenseFilters, CategoryConfig types

utils/
  currency.ts            # formatCurrency, formatCompact
  storage.ts             # localStorage load/save helpers
  export.ts              # CSV export
```

## Data Model

```ts
interface Expense {
  id: string;
  date: string;        // YYYY-MM-DD
  amount: number;
  category: string;
  description: string;
  createdAt: string;   // ISO timestamp
}
```

localStorage keys:
- `expense-tracker-expenses` — expense array
- `expense-tracker-budget` — monthly budget amount
- `expense-tracker-categories` — custom user-defined categories
