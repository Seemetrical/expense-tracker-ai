'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Expense, Category } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { format } from 'date-fns';

interface Props {
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Expense;
}

interface FormState {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

interface FormErrors {
  date?: string;
  amount?: string;
  description?: string;
}

const DEFAULT_FORM: FormState = {
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: '',
  category: 'Food',
  description: '',
};

export default function ExpenseForm({ onSubmit, onCancel, initialData }: Props) {
  const [form, setForm] = useState<FormState>(
    initialData
      ? {
          date: initialData.date,
          amount: initialData.amount.toString(),
          category: initialData.category,
          description: initialData.description,
        }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.date) errs.date = 'Date is required';
    const amt = parseFloat(form.amount);
    if (!form.amount) errs.amount = 'Amount is required';
    else if (isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid positive amount';
    else if (amt > 1_000_000) errs.amount = 'Amount is too large';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.trim().length > 100) errs.description = 'Max 100 characters';
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    onSubmit({
      date: form.date,
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
      category: form.category,
      description: form.description.trim(),
    });
  }

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={form.date}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => set('date', e.target.value)}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount ($)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            className={`w-full rounded-lg border pl-7 pr-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => set('category', cat)}
              className={`rounded-lg border py-2 px-1 text-xs font-medium transition-all
                ${form.category === cat
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          placeholder="e.g. Lunch at work"
          maxLength={100}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">{form.description.length}/100</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-70"
        >
          {initialData ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
