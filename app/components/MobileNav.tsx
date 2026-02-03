import { NavLink } from "react-router";
import { LayoutDashboard, Receipt, PieChart, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "仪表盘", href: "/", icon: LayoutDashboard },
  { name: "明细", href: "/transactions", icon: Receipt },
  { name: "统计", href: "/analytics", icon: PieChart },
  { name: "设置", href: "/settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full gap-1",
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
