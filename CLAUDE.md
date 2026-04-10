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

## Version control for feature changes

Every feature change must be committed to a dedicated branch before merging. Branch and commit names follow this convention:

```
feature_<description_of_feature>_<version>
```

- `description_of_feature`: short snake_case summary of what the feature does (e.g. `dynamic_categories`, `csv_export`, `recurring_expenses`)
- `version`: integer starting at `1`, incremented for each iteration of the same feature (e.g. `_1`, `_2`)

**Examples:**
```
feature_dynamic_categories_1
feature_csv_export_1
feature_dark_mode_1
feature_dynamic_categories_2   # second iteration / revision
```

**Workflow for every feature:**
1. Create a branch: `git checkout -b feature_<description>_<version>`
2. Make all changes for that feature on the branch
3. Commit with a matching message: `git commit -m "feature_<description>_<version>: <what changed>"`
4. Open a PR into `main` — do not commit feature work directly to `main`

**Versioning rules:**
- Start at `_1` for every new feature
- Increment the version (e.g. `_1` → `_2`) when reopening or significantly revising a previously completed feature
- Bug fixes within the same feature iteration stay on the same branch/version
