import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Transaction, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetData: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '工资', type: 'income', color: '#10B981', icon: 'Wallet' },
  { id: '2', name: '理财', type: 'income', color: '#3B82F6', icon: 'TrendingUp' },
  { id: '3', name: '餐饮', type: 'expense', color: '#F59E0B', icon: 'Utensils' },
  { id: '4', name: '交通', type: 'expense', color: '#EF4444', icon: 'Car' },
  { id: '5', name: '购物', type: 'expense', color: '#8B5CF6', icon: 'ShoppingBag' },
  { id: '6', name: '娱乐', type: 'expense', color: '#EC4899', icon: 'Gamepad2' },
  { id: '7', name: '居住', type: 'expense', color: '#6366F1', icon: 'Home' },
];

export const useStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: uuidv4(),
              createdAt: Date.now(),
            },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: uuidv4() }],
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      resetData: () => set({ transactions: [], categories: DEFAULT_CATEGORIES }),
    }),
    {
      name: 'finance-flow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
