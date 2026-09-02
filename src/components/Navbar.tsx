import React from 'react';
import { Home, Users, Receipt, Settings2, BookOpen, Layers } from 'lucide-react';

export type TabType = 'home' | 'customers' | 'invoicing' | 'operations' | 'accounts' | 'billing' | 'cosmetics' | 'history';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingDueCount: number;
  lowStockCount: number;
  totalInvoicesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pendingDueCount,
  lowStockCount,
  totalInvoicesCount,
}) => {
  // Check if activeTab belongs to invoicing group
  const isInvoicingActive =
    activeTab === 'invoicing' ||
    activeTab === 'billing' ||
    activeTab === 'cosmetics' ||
    activeTab === 'history';

  const navItems = [
    {
      id: 'home' as TabType,
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      isActive: activeTab === 'home',
    },
    {
      id: 'customers' as TabType,
      label: 'Customers',
      icon: <Users className="w-4 h-4" />,
      badge: pendingDueCount > 0 ? pendingDueCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
      isActive: activeTab === 'customers',
    },
    {
      id: 'invoicing' as TabType,
      label: 'Billing & Invoices',
      icon: <Receipt className="w-4 h-4" />,
      badge: totalInvoicesCount > 0 ? totalInvoicesCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      isActive: isInvoicingActive,
    },
    {
      id: 'operations' as TabType,
      label: 'Operations & Stock',
      icon: <Settings2 className="w-4 h-4" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      isActive: activeTab === 'operations',
    },
    {
      id: 'accounts' as TabType,
      label: 'Day Book',
      icon: <BookOpen className="w-4 h-4" />,
      isActive: activeTab === 'accounts',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2">
          {navItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  item.isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      item.isActive
                        ? 'bg-white text-indigo-700'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
