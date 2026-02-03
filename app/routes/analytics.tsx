import { useMemo, useState } from 'react';
// import type { Route } from "./+types/analytics";
import { useStore } from "../store/useStore";
import { formatCurrency, cn } from "../lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMounted } from "../hooks/useMounted";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function meta({}: any) {
  return [
    { title: "Analytics - FinanceFlow" },
    { name: "description", content: "Analyze your financial data" },
  ];
}

export default function Analytics() {
  const { transactions, categories } = useStore();
  const mounted = useMounted();
  const [pieMonth, setPieMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Pie Chart Data: Expenses by Category for selected month
  const pieData = useMemo(() => {
    const start = startOfMonth(parseISO(pieMonth + '-01'));
    const end = endOfMonth(start);
    
    const categoryTotals: Record<string, number> = {};
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'expense' && isWithinInterval(parseISO(t.date), { start, end })) {
        const amount = Number(t.amount);
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
        totalExpense += amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([catId, value]) => {
        const category = categories.find(c => c.id === catId);
        return {
          name: category?.name || 'Unknown',
          value,
          color: category?.color || '#9ca3af',
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories, pieMonth]);

  // Bar Chart Data: Income vs Expense for last 6 months
  const barData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      let income = 0;
      let expense = 0;

      transactions.forEach(t => {
        if (isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })) {
          if (t.type === 'income') income += Number(t.amount);
          else expense += Number(t.amount);
        }
      });

      data.push({
        name: format(date, 'yyyy-MM'), // Full format for sorting/key
        label: format(date, 'MMM', { locale: zhCN }), // Display format
        income,
        expense,
      });
    }
    return data;
  }, [transactions]);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">统计分析</h1>
        <p className="text-gray-500 dark:text-gray-400">可视化您的财务健康状况</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Structure (Pie Chart) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">支出结构</h2>
            <input
              type="month"
              value={pieMonth}
              onChange={(e) => setPieMonth(e.target.value)}
              className="text-sm border-none bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1 outline-none text-gray-700 dark:text-gray-300"
            />
          </div>
          
          <div className="h-[300px] w-full relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(Number(value || 0))}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#374151' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                本月暂无支出数据
              </div>
            )}
          </div>
        </div>

        {/* Income vs Expense (Bar Chart) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">收支对比 (近6个月)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value || 0))}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" align="right" />
                <Bar dataKey="income" name="收入" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="支出" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
