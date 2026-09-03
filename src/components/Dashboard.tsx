import React from 'react';
import {
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  Download,
  DollarSign,
  FileText,
  Boxes,
  BookOpen,
} from 'lucide-react';
import {
  Product,
  CosmeticProduct,
  CustomerProfile,
  SaleRecord,
  PurchaseRecord,
  ExpenseRecord,
} from '../types';
import {
  formatCurrency,
  formatDateDDMMYYYY,
  getTodayDateString,
} from '../utils/formatters';

interface DashboardProps {
  onDownloadBackup?: () => void;
  products: Product[];
  cosProducts: CosmeticProduct[];
  customers: CustomerProfile[];
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
  onNavigate: (tab: any) => void;
  onViewInvoice?: (sale: SaleRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  cosProducts,
  customers,
  sales,
  purchases,
  expenses,
  onNavigate,
  onDownloadBackup,
}) => {
  const today = getTodayDateString();

  // Metrics
  const lowStockCleaning = products.filter((p) => Number(p.stock) <= 5);
  const lowStockCosmetics = cosProducts.filter((p) => Number(p.stock) <= 5);
  const totalLowStock = lowStockCleaning.length + lowStockCosmetics.length;

  const totalProducts = products.length + cosProducts.length;
  const totalPendingDue = sales.reduce((acc, s) => acc + (s.pendingAmount || 0), 0);

  // Today's numbers
  const todaySales = sales
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + (s.grandTotal || 0), 0);

  const todayCollection = sales
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + (s.paidAmount || 0), 0);

  const todayPurchases = purchases
    .filter((p) => p.date === today)
    .reduce((sum, p) => sum + (p.rawCost || 0), 0);

  const todayExpenses = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-xl p-5 sm:p-6 text-white shadow-sm border border-indigo-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-2.5 py-0.5 rounded font-bold">
                FIA POS SYSTEM
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Live
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2 text-white uppercase tracking-tight">
              FIA CLEAN AND CARE
            </h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Wholesale & Retail • Edathanattukara • Mob: 8086452106
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('billing')}
              className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2.5 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>+ Cleaning Bill</span>
            </button>
            <button
              onClick={() => onNavigate('cosmetics')}
              className="flex-1 sm:flex-initial bg-pink-600 hover:bg-pink-500 text-white px-3.5 py-2.5 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>+ Cosmetics Bill</span>
            </button>
            {onDownloadBackup && (
              <button
                onClick={onDownloadBackup}
                className="flex-1 sm:flex-initial bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                title="Download JSON Database Backup"
              >
                <Download className="w-4 h-4" />
                <span className="text-white">Backup JSON</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('operations')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Stock Items
            </span>
            <Package className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">{totalProducts}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {products.length} Clean • {cosProducts.length} Cos
          </p>
        </div>

        <div
          onClick={() => onNavigate('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Customers
            </span>
            <Users className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">{customers.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Directory & Dues</p>
        </div>

        <div
          onClick={() => onNavigate('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Pending Due
            </span>
            <DollarSign className="w-4 h-4 text-rose-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-2">
            {formatCurrency(totalPendingDue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Uncollected balances</p>
        </div>

        <div
          onClick={() => onNavigate('operations')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Low Stock
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-2 ${
              totalLowStock > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {totalLowStock}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Items ≤ 5 units</p>
        </div>
      </div>

      {/* Operations & Stock Quick Access Shortcuts */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
              Operations & Stock Quick Access
            </h3>
          </div>
          <button
            onClick={() => onNavigate('operations')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Stock Inventory */}
          <button
            onClick={() => onNavigate('stock')}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 transition text-left group cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                📦 Stock Inventory
              </span>
              <p className="text-xs font-bold text-slate-900">
                {products.length} Clean • {cosProducts.length} Cos
              </p>
              <span className="text-[10px] text-slate-500">
                {totalLowStock > 0 ? `${totalLowStock} items low` : 'All stocks healthy'}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 2. Purchases */}
          <button
            onClick={() => onNavigate('purchases')}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition text-left group cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                🛒 Purchases
              </span>
              <p className="text-xs font-bold text-slate-900">
                {purchases.length} Records
              </p>
              <span className="text-[10px] text-slate-500">
                Today: {formatCurrency(todayPurchases)}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 3. Expenses History */}
          <button
            onClick={() => onNavigate('expenses')}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-rose-50/60 hover:border-rose-300 transition text-left group cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                💸 Expense History
              </span>
              <p className="text-xs font-bold text-slate-900">
                {expenses.length} Records
              </p>
              <span className="text-[10px] text-slate-500">
                Today: {formatCurrency(todayExpenses)}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if active */}
      {totalLowStock > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Low Stock Warning Detected ({totalLowStock} items)</span>
            </div>
            <button
              onClick={() => onNavigate('operations')}
              className="text-xs text-amber-700 underline font-semibold"
            >
              Manage Stock →
            </button>
          </div>
          <div className="mt-2 text-xs text-amber-800 flex flex-wrap gap-2">
            {lowStockCleaning.map((p) => (
              <span
                key={p.id}
                className="bg-white/90 border border-amber-200 px-2 py-0.5 rounded text-[11px]"
              >
                {p.name}: <strong className="text-rose-600">{p.stock} {p.unit}</strong>
              </span>
            ))}
            {lowStockCosmetics.map((p) => (
              <span
                key={p.id}
                className="bg-white/90 border border-amber-200 px-2 py-0.5 rounded text-[11px]"
              >
                {p.name}: <strong className="text-rose-600">{p.stock} Units</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Today's Financial Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Metrics */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Today's Business Summary
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Date: {formatDateDDMMYYYY(today)}</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded">
              TODAY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Sales Today</span>
              <div className="text-xl font-bold font-mono text-indigo-700 mt-1">
                {formatCurrency(todaySales)}
              </div>
            </div>

            <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                Cash / Online Received
              </span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {formatCurrency(todayCollection)}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Purchases Today</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">
                {formatCurrency(todayPurchases)}
              </div>
            </div>

            <div className="bg-rose-50/50 p-3.5 rounded-lg border border-rose-100">
              <span className="text-[10px] font-bold text-rose-600 uppercase">Expenses Today</span>
              <div className="text-lg font-bold font-mono text-rose-600 mt-1">
                {formatCurrency(todayExpenses)}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('accounts')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Open Complete Day Book (Accounts)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Launch Panel */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Quick Actions
            </h3>
            <p className="text-[11px] text-slate-400">Direct shortcuts to frequent operations</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('billing')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition text-left space-y-1 group"
            >
              <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-800">Cleaning POS</div>
              <p className="text-[10px] text-slate-400">ML conversion & bulk billing</p>
            </button>

            <button
              onClick={() => onNavigate('cosmetics')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-pink-500 hover:bg-pink-50/30 transition text-left space-y-1 group"
            >
              <div className="w-8 h-8 rounded-md bg-pink-100 text-pink-700 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-800">Cosmetics POS</div>
              <p className="text-[10px] text-slate-400">Unit & itemized billing</p>
            </button>

            <button
              onClick={() => onNavigate('customers')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition text-left space-y-1 group"
            >
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <Users className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-800">Customer Directory</div>
              <p className="text-[10px] text-slate-400">Manage names, phones & dues</p>
            </button>

            <button
              onClick={() => onNavigate('invoicing')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition text-left space-y-1 group"
            >
              <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <FileText className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-800">Invoice History</div>
              <p className="text-[10px] text-slate-400">Search, edit & reprint bills</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
