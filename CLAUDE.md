# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npx tsc --noEmit  # Type-check without building
```

## Architecture

**Global state lives in `app/providers.tsx`** — a single `Providers` client component wraps the entire app. It holds the `useExpenses` hook instance, the add/edit modal state, and the toast notification queue. All pages access shared state via `useExpenseContext()`. The modal for add/edit is rendered once here, not per-page.

**`hooks/useExpenses.ts`** is the central data layer. It handles:
- localStorage persistence (load on mount, save on every change via `useEffect`)
- CRUD: `addExpense`, `updateExpense`, `deleteExpense`
- Filtering + sorting (derived from `expenses` + `filters` + `sortField`/`sortOrder`)
- Analytics computed values: `totalAllTime`, `totalThisMonth`, `spendingByCategory`, `monthlyData` (last 6 months)

**Routes:**
- `/` — Dashboard with summary cards, pie chart, bar chart, recent expenses
- `/expenses` — Full filterable/sortable expense table with CSV export

**Charts (`components/dashboard/`)** use Recharts. Both chart components use `dynamic()` with `{ ssr: false }` — required because Recharts is browser-only. Each recharts primitive (`PieChart`, `Bar`, etc.) is imported via a separate `dynamic()` call.

**Data types** (`types/expense.ts`): `Expense` has `id`, `date` (YYYY-MM-DD string), `amount` (number), `category` (union type), `description`, `createdAt` (ISO timestamp). `ExpenseFilters` drives both the filter UI and the derived `filteredExpenses` array.

**Category config** in `constants/categories.ts` is the single source of truth for category colors, icons, and chart hex codes — used by `CategoryBadge`, the pie chart, and the legend.

## Key conventions

- All interactive components have `'use client'` at the top
- Dates are stored as `YYYY-MM-DD` strings (not Date objects) for simple string comparison in filter logic
- Toast notifications are managed in `providers.tsx` — `deleteExpense` and `addExpense`/`updateExpense` are wrapped there to inject toasts, so the hook's own methods don't trigger toasts directly
- localStorage key: `expense-tracker-expenses`
