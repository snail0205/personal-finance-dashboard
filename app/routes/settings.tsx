import { useState, useEffect } from 'react';
// import type { Route } from "./+types/settings";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { Trash2, Plus, Download, Moon, Sun, RotateCcw, Save } from "lucide-react";
import { useMounted } from "../hooks/useMounted";
import type { TransactionType } from '../types';

export function meta({}: any) {
  return [
    { title: "Settings - FinanceFlow" },
    { name: "description", content: "App Settings" },
  ];
}

export default function Settings() {
  const { categories, addCategory, deleteCategory, resetData, transactions } = useStore();
  const mounted = useMounted();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<TransactionType>('expense');
  const [newCategoryColor, setNewCategoryColor] = useState('#EF4444');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    addCategory({
      name: newCategoryName,
      type: newCategoryType,
      color: newCategoryColor,
    });

    setNewCategoryName('');
  };

  const handleExport = () => {
    const data = JSON.stringify({ transactions, categories }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作无法撤销！')) {
      resetData();
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">设置</h1>
        <p className="text-gray-500 dark:text-gray-400">偏好设置与数据管理</p>
      </header>

      {/* Theme */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">外观</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">深色模式</span>
          <button
            onClick={toggleTheme}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
              isDark ? "bg-emerald-500" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isDark ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">分类管理</h2>
        
        {/* Add Category */}
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-4 mb-8 items-end p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">分类名称</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="例如：健身"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">类型</label>
            <select
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value as TransactionType)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="expense">支出</option>
              <option value="income">收入</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="h-9 w-16 p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={!newCategoryName}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Expense Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">支出分类</h3>
            <div className="space-y-2">
              {categories.filter(c => c.type === 'expense').map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-gray-700 dark:text-gray-200">{category.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`确定删除分类 "${category.name}" 吗？`)) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">收入分类</h3>
            <div className="space-y-2">
              {categories.filter(c => c.type === 'income').map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-gray-700 dark:text-gray-200">{category.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`确定删除分类 "${category.name}" 吗？`)) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">数据管理</h2>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            导出数据 (JSON)
          </button>
          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            清除所有数据
          </button>
        </div>
      </section>
    </div>
  );
}
