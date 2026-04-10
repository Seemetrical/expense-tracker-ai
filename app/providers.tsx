'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { Expense, CategoryConfig } from '@/types/expense';
import Modal from '@/components/ui/Modal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Navbar from '@/components/layout/Navbar';

type ExpenseContext = ReturnType<typeof useExpenses> & {
  openAddModal: () => void;
  openEditModal: (expense: Expense) => void;
  allCategories: string[];
  categoryConfig: Record<string, CategoryConfig>;
  getCategoryConfig: (name: string) => CategoryConfig;
  addCategory: (name: string) => boolean;
};

const Ctx = createContext<ExpenseContext | null>(null);

export function useExpenseContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useExpenseContext must be used within ExpenseProvider');
  return ctx;
}

export default function Providers({ children }: { children: ReactNode }) {
  const expenses = useExpenses();
  const categories = useCategories();
  const [modalState, setModalState] = useState<{ open: boolean; editing?: Expense }>({ open: false });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(message: string, type: 'success' | 'error') {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const openAddModal = useCallback(() => setModalState({ open: true }), []);
  const openEditModal = useCallback((expense: Expense) => setModalState({ open: true, editing: expense }), []);

  function handleSubmit(data: Omit<Expense, 'id' | 'createdAt'>) {
    if (modalState.editing) {
      expenses.updateExpense(modalState.editing.id, data);
      addToast('Expense updated successfully', 'success');
    } else {
      expenses.addExpense(data);
      addToast('Expense added successfully', 'success');
    }
    setModalState({ open: false });
  }

  function handleDelete(id: string) {
    expenses.deleteExpense(id);
    addToast('Expense deleted', 'success');
  }

  const ctx: ExpenseContext = {
    ...expenses,
    deleteExpense: handleDelete,
    openAddModal,
    openEditModal,
    allCategories: categories.allCategories,
    categoryConfig: categories.categoryConfig,
    getCategoryConfig: categories.getCategoryConfig,
    addCategory: categories.addCategory,
  };

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-screen bg-slate-50">
        <Navbar onAddClick={openAddModal} />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>

      <Modal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false })}
        title={modalState.editing ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => setModalState({ open: false })}
          initialData={modalState.editing}
          categories={categories.allCategories}
          onAddCategory={categories.addCategory}
        />
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Ctx.Provider>
  );
}
