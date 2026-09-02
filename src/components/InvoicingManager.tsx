import React, { useState, useEffect } from 'react';
import { Sparkles, Receipt, History } from 'lucide-react';
import { Product, CosmeticProduct, CustomerProfile, SaleRecord } from '../types';
import { Billing } from './Billing';
import { CosmeticsBilling } from './CosmeticsBilling';
import { BillingHistory } from './BillingHistory';

interface InvoicingManagerProps {
  products: Product[];
  cosProducts: CosmeticProduct[];
  customers: CustomerProfile[];
  sales: SaleRecord[];
  onSaveSale: (sale: SaleRecord) => void;
  onUpdateSale: (sale: SaleRecord) => void;
  onDeleteSale: (saleId: string) => void;
  onAddCustomer: (customer: CustomerProfile) => void;
  onViewInvoice: (sale: SaleRecord) => void;
  onEditSale?: (sale: SaleRecord) => void;
  initialSubTab?: 'cleaning' | 'cosmetics' | 'history';
}

export const InvoicingManager: React.FC<InvoicingManagerProps> = ({
  products,
  cosProducts,
  customers,
  sales,
  onSaveSale,
  onUpdateSale,
  onDeleteSale,
  onAddCustomer,
  onViewInvoice,
  initialSubTab = 'cleaning',
}) => {
  const [subTab, setSubTab] = useState<'cleaning' | 'cosmetics' | 'history'>(initialSubTab);
  const [editingCleaningSale, setEditingCleaningSale] = useState<SaleRecord | null>(null);
  const [editingCosmeticsSale, setEditingCosmeticsSale] = useState<SaleRecord | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleEditSale = (sale: SaleRecord) => {
    if (sale.type === 'cleaning') {
      setEditingCleaningSale(sale);
      setSubTab('cleaning');
    } else {
      setEditingCosmeticsSale(sale);
      setSubTab('cosmetics');
    }
  };

  const cleaningSalesCount = sales.filter((s) => s.type === 'cleaning').length;
  const cosmeticsSalesCount = sales.filter((s) => s.type === 'cosmetics').length;

  return (
    <div className="space-y-6">
      {/* Sub-navigation Header for Billing & Invoices */}
      <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Cleaning Billing Tab */}
          <button
            onClick={() => {
              setSubTab('cleaning');
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'cleaning'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Cleaning Billing</span>
            {editingCleaningSale && (
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                EDIT
              </span>
            )}
          </button>

          {/* Cosmetics Billing Tab */}
          <button
            onClick={() => {
              setSubTab('cosmetics');
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'cosmetics'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Cosmetics Billing</span>
            {editingCosmeticsSale && (
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                EDIT
              </span>
            )}
          </button>

          {/* Invoice History Tab */}
          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'history'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Invoice History</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                subTab === 'history'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {sales.length}
            </span>
          </button>
        </div>

        {/* Quick summary pill */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-medium px-2">
          <span>
            Clean Bills:{' '}
            <strong className="font-mono text-slate-900">{cleaningSalesCount}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Cosmetics Bills:{' '}
            <strong className="font-mono text-slate-900">{cosmeticsSalesCount}</strong>
          </span>
        </div>
      </div>

      {/* Tab Views */}
      {subTab === 'cleaning' && (
        <Billing
          products={products}
          customers={customers}
          sales={sales}
          onSaveSale={onSaveSale}
          onUpdateSale={onUpdateSale}
          onDeleteSale={onDeleteSale}
          onAddCustomer={onAddCustomer}
          onViewInvoice={onViewInvoice}
          editingSale={editingCleaningSale}
          onClearEditingSale={() => setEditingCleaningSale(null)}
          onNavigateToHistory={() => setSubTab('history')}
        />
      )}

      {subTab === 'cosmetics' && (
        <CosmeticsBilling
          products={cosProducts}
          customers={customers}
          sales={sales}
          onSaveSale={onSaveSale}
          onUpdateSale={onUpdateSale}
          onDeleteSale={onDeleteSale}
          onAddCustomer={onAddCustomer}
          onViewInvoice={onViewInvoice}
          editingSale={editingCosmeticsSale}
          onClearEditingSale={() => setEditingCosmeticsSale(null)}
          onNavigateToHistory={() => setSubTab('history')}
        />
      )}

      {subTab === 'history' && (
        <BillingHistory
          sales={sales}
          onViewInvoice={onViewInvoice}
          onEditSale={handleEditSale}
          onDeleteSale={onDeleteSale}
          onNavigateToBilling={(type) => setSubTab(type)}
        />
      )}
    </div>
  );
};
