import { useState, useMemo } from 'react';
// import type { Route } from "./+types/transactions";
import { useStore } from "../store/useStore";
import { formatCurrency, formatDate, cn } from "../lib/utils";
import { Plus, Filter, Trash2, Edit2 } from "lucide-react";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { useMounted } from "../hooks/useMounted";
import { format, parseISO, startOfMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Transaction } from '../types';

export function meta({}: any) {
  return [
    { title: "Transactions - FinanceFlow" },
    { name: "description", content: "Manage your transactions" },
  ];
}

export default function Transactions() {
  const { transactions, categories, deleteTransaction } = useStore();
  const mounted = useMounted();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Generate month options from transactions
  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(t => {
      months.add(format(parseISO(t.date), 'yyyy-MM'));
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (selectedMonth !== 'all') {
      result = result.filter(t => t.date.startsWith(selectedMonth));
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const getCategoryColor = (catId: string) => {
    return categories.find(c => c.id === catId)?.color || '#9ca3af';
  };
  
  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || '未知分类';
  };

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteTransaction(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">收支明细</h1>
          <p className="text-gray-500 dark:text-gray-400">管理您的所有每一笔账单</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>记一笔</span>
        </button>
      </header>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
          >
            <option value="all">全部时间</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {format(parseISO(month + '-01'), 'yyyy年M月', { locale: zhCN })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">
                {formatDate(date)}
              </h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {groupedTransactions[date].map((t, index) => (
                  <div 
                    key={t.id} 
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group",
                      index !== groupedTransactions[date].length - 1 && "border-b border-gray-100 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-10 rounded-full" style={{ backgroundColor: getCategoryColor(t.category) }}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{getCategoryName(t.category)}</p>
                        {t.note && <p className="text-xs text-gray-400">{t.note}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "font-bold text-lg",
                        t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">暂无交易记录</p>
          </div>
        )}
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        transactionToEdit={editingTransaction} 
      />
    </div>
  );
}
