import { NavLink } from "react-router";
import { LayoutDashboard, Receipt, PieChart, Settings, Wallet } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "仪表盘", href: "/", icon: LayoutDashboard },
  { name: "收支明细", href: "/transactions", icon: Receipt },
  { name: "统计分析", href: "/analytics", icon: PieChart },
  { name: "设置", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          FinanceFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
            当前版本
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0 (MVP)</p>
        </div>
      </div>
    </aside>
  );
}
