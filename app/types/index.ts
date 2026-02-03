export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string; // 关联 Category id
  date: string; // ISO 格式日期 YYYY-MM-DD
  note?: string;
  createdAt: number; //用于排序
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string; // 用于图表显示的颜色 (Hex code)
  icon?: string; // 可选图标标识
}

export interface Budget {
  categoryId: string;
  limit: number;
  period: 'monthly';
}
