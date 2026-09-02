/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { InvoicingManager } from './components/InvoicingManager';
import { CustomerManager } from './components/CustomerManager';
import { OperationsManager } from './components/OperationsManager';
import { DayBook } from './components/DayBook';
import { BillInvoiceModal } from './components/BillInvoiceModal';
import { PinModal } from './components/PinModal';
import { SettingsModal } from './components/SettingsModal';
import {
  initialCleaningProducts,
  initialCosmeticProducts,
  initialCustomers,
  initialSuppliers,
  initialSales,
  initialPurchases,
  initialExpenses,
} from './data/initialData';
import {
  Product,
  CosmeticProduct,
  CustomerProfile,
  Supplier,
  SaleRecord,
  PurchaseRecord,
  ExpenseRecord,
  StockReturnRecord,
} from './types';

export default function App() {
  // Authentication & Security - Starts locked by default (requires login on opening)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [appPin, setAppPin] = useState<string>(() => {
    return localStorage.getItem('fia_app_pin') || '1234';
  });

  // Navigation: Defaults to Dashboard
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [invoicingSubTab, setInvoicingSubTab] = useState<'cleaning' | 'cosmetics' | 'history'>('cleaning');

  // Modals
  const [previewSale, setPreviewSale] = useState<SaleRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filter predicates to completely eliminate preloaded demo/sample records
  const isPreloadedCleaningProduct = (p: Product) => {
    if (!p) return true;
    const dummyIds = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6'];
    const dummyNames = [
      'dish wash liquid (concentrate)',
      'floor cleaner & disinfectant',
      'premium car wash shampoo',
      'toilet cleaner power gel',
      'liquid laundry detergent',
      'glass & surface cleaner',
    ];
    const dummyBarcodes = [
      '8901234001',
      '8901234002',
      '8901234003',
      '8901234004',
      '8901234005',
      '8901234006',
    ];
    return (
      dummyIds.includes(p.id) ||
      dummyNames.includes((p.name || '').trim().toLowerCase()) ||
      (p.barcode && dummyBarcodes.includes(p.barcode.trim()))
    );
  };

  const isPreloadedCosmeticProduct = (p: CosmeticProduct) => {
    if (!p) return true;
    const dummyIds = ['cprod_1', 'cprod_2', 'cprod_3', 'cprod_4'];
    const dummyNames = [
      'pure herbal hair oil',
      'moisturizing face wash aloe',
      'rose water toner pure',
      'herbal body lotion 200ml',
    ];
    const dummyBarcodes = ['8905678001', '8905678002', '8905678003', '8905678004'];
    return (
      dummyIds.includes(p.id) ||
      dummyNames.includes((p.name || '').trim().toLowerCase()) ||
      (p.barcode && dummyBarcodes.includes(p.barcode.trim()))
    );
  };

  const isPreloadedSupplier = (s: Supplier) => {
    if (!s) return true;
    const dummyIds = ['sup_1', 'sup_2', 'sup_3'];
    const dummyNames = [
      'kerala chem agencies',
      'crown packaging ind.',
      'green herbs traders',
    ];
    const dummyMobiles = ['9846012345', '9447112233', '9744889900'];
    return (
      dummyIds.includes(s.id) ||
      dummyNames.includes((s.name || '').trim().toLowerCase()) ||
      (s.mobile && dummyMobiles.includes(s.mobile.trim()))
    );
  };

  const isPreloadedMockCustomer = (c: CustomerProfile) => {
    if (!c || !c.name) return true;
    const dummyIds = ['cust_1', 'cust_2', 'cust_3', 'cust_4', 'cust_5'];
    const dummyNames = [
      'rahul k.',
      'anjali nair',
      'saji thomas',
      'al-madina hypermarket',
      'walk-in customer',
    ];
    const dummyPhones = ['9847123456', '9446011223', '9745566778', '9895001122'];
    return (
      dummyIds.includes(c.id) ||
      dummyNames.includes(c.name.trim().toLowerCase()) ||
      (c.phone && dummyPhones.includes(c.phone.trim()))
    );
  };

  const isPreloadedSale = (s: SaleRecord) => {
    if (!s) return true;
    const dummyIds = ['sale_1', 'sale_2', 'sale_3'];
    const dummyBillNos = ['cln-0042', 'cln-0041', 'cos-0012'];
    const dummyCustomerNames = [
      'rahul k.',
      'anjali nair',
      'saji thomas',
      'al-madina hypermarket',
      'walk-in customer',
    ];
    if (dummyIds.includes(s.id)) return true;
    if (s.billNo && dummyBillNos.includes(s.billNo.trim().toLowerCase())) return true;
    if (s.name && dummyCustomerNames.includes(s.name.trim().toLowerCase())) return true;
    return false;
  };

  const isPreloadedPurchase = (p: PurchaseRecord) => {
    if (!p) return true;
    const dummyIds = ['purch_1'];
    const dummySuppliers = ['kerala chem agencies', 'crown packaging ind.', 'green herbs traders'];
    if (dummyIds.includes(p.id)) return true;
    if (dummySuppliers.includes((p.supplierName || '').trim().toLowerCase())) return true;
    if ((p.rawMaterial || '').trim().toLowerCase() === 'dish wash raw concentrate') return true;
    return false;
  };

  const isPreloadedExpense = (e: ExpenseRecord) => {
    if (!e) return true;
    const dummyIds = ['exp_1', 'exp_2'];
    const dummyTitles = [
      'electricity bill shop',
      'delivery & transport charges',
    ];
    if (dummyIds.includes(e.id)) return true;
    if (dummyTitles.includes((e.title || '').trim().toLowerCase())) return true;
    return false;
  };

  // Application Data States (Loaded clean from localStorage or initial seed)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('fia_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.filter((p) => !isPreloadedCleaningProduct(p));
      }
      return initialCleaningProducts;
    } catch {
      return initialCleaningProducts;
    }
  });

  const [cosProducts, setCosProducts] = useState<CosmeticProduct[]>(() => {
    try {
      const saved = localStorage.getItem('fia_cosproducts');
      if (saved) {
        const parsed: CosmeticProduct[] = JSON.parse(saved);
        return parsed.filter((p) => !isPreloadedCosmeticProduct(p));
      }
      return initialCosmeticProducts;
    } catch {
      return initialCosmeticProducts;
    }
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('fia_customers_profiles');
      if (saved) {
        const parsed: CustomerProfile[] = JSON.parse(saved);
        return parsed.filter((c) => !isPreloadedMockCustomer(c));
      }
      return initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('fia_suppliers');
      if (saved) {
        const parsed: Supplier[] = JSON.parse(saved);
        return parsed.filter((s) => !isPreloadedSupplier(s));
      }
      return initialSuppliers;
    } catch {
      return initialSuppliers;
    }
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fia_sales_records');
      if (saved) {
        const parsed: SaleRecord[] = JSON.parse(saved);
        return parsed.filter((s) => !isPreloadedSale(s));
      }
      return initialSales;
    } catch {
      return initialSales;
    }
  });

  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fia_purchases_records');
      if (saved) {
        const parsed: PurchaseRecord[] = JSON.parse(saved);
        return parsed.filter((p) => !isPreloadedPurchase(p));
      }
      return initialPurchases;
    } catch {
      return initialPurchases;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fia_expenses_records');
      if (saved) {
        const parsed: ExpenseRecord[] = JSON.parse(saved);
        return parsed.filter((e) => !isPreloadedExpense(e));
      }
      return initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  const [stockReturns, setStockReturns] = useState<StockReturnRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fia_stock_returns_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [clearedDayBookIds, setClearedDayBookIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fia_cleared_daybook_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cloud / Offline Sync state
  const [syncStatus, setSyncStatus] = useState<{ connected: boolean; message: string }>({
    connected: true,
    message: 'Local Cache Active',
  });

  // Persist states to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fia_products', JSON.stringify(products));
      localStorage.setItem('fia_cosproducts', JSON.stringify(cosProducts));
      localStorage.setItem('fia_customers_profiles', JSON.stringify(customers));
      localStorage.setItem('fia_suppliers', JSON.stringify(suppliers));
      localStorage.setItem('fia_sales_records', JSON.stringify(sales));
      localStorage.setItem('fia_purchases_records', JSON.stringify(purchases));
      localStorage.setItem('fia_expenses_records', JSON.stringify(expenses));
      localStorage.setItem('fia_stock_returns_records', JSON.stringify(stockReturns));
      localStorage.setItem('fia_cleared_daybook_ids', JSON.stringify(clearedDayBookIds));
      localStorage.setItem('fia_app_pin', appPin);
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [
    products,
    cosProducts,
    customers,
    suppliers,
    sales,
    purchases,
    expenses,
    stockReturns,
    clearedDayBookIds,
    appPin,
  ]);

  // Handlers for Products
  const handleSaveProduct = (newProd: Product) => {
    setProducts((prev) => [...prev, newProd]);
  };
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers for Cosmetics
  const handleSaveCosProduct = (newProd: CosmeticProduct) => {
    setCosProducts((prev) => [...prev, newProd]);
  };
  const handleUpdateCosProduct = (updated: CosmeticProduct) => {
    setCosProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const handleDeleteCosProduct = (id: string) => {
    setCosProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers for Customers
  const handleAddCustomer = (c: CustomerProfile) => {
    setCustomers((prev) => [...prev, c]);
  };
  const handleUpdateCustomer = (updated: CustomerProfile) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };
  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };
  const handleClearAllCustomers = () => {
    setCustomers([]);
    try {
      localStorage.setItem('fia_customers_profiles', JSON.stringify([]));
    } catch (e) {
      console.warn('Error clearing customer profiles:', e);
    }
  };

  const handleClearAllData = () => {
    setProducts([]);
    setCosProducts([]);
    setCustomers([]);
    setSuppliers([]);
    setSales([]);
    setPurchases([]);
    setExpenses([]);
    setStockReturns([]);
    setClearedDayBookIds([]);
    try {
      localStorage.setItem('fia_products', JSON.stringify([]));
      localStorage.setItem('fia_cosproducts', JSON.stringify([]));
      localStorage.setItem('fia_customers_profiles', JSON.stringify([]));
      localStorage.setItem('fia_suppliers', JSON.stringify([]));
      localStorage.setItem('fia_sales_records', JSON.stringify([]));
      localStorage.setItem('fia_purchases_records', JSON.stringify([]));
      localStorage.setItem('fia_expenses_records', JSON.stringify([]));
      localStorage.setItem('fia_stock_returns_records', JSON.stringify([]));
      localStorage.setItem('fia_cleared_daybook_ids', JSON.stringify([]));
    } catch (e) {
      console.warn('Error clearing all app data:', e);
    }
  };

  // Handlers for Sales
  const handleSaveSale = (sale: SaleRecord) => {
    // Deduct stock for all items
    if (sale.type === 'cleaning') {
      setProducts((prev) =>
        prev.map((p) => {
          const matchingItems = sale.items.filter((item) => item.stockId === p.id);
          const deduction = matchingItems.reduce((sum, i) => sum + i.stockDeductionQty, 0);
          return deduction > 0 ? { ...p, stock: Math.max(0, p.stock - deduction) } : p;
        })
      );
    } else {
      setCosProducts((prev) =>
        prev.map((p) => {
          const matchingItems = sale.items.filter((item) => item.stockId === p.id);
          const deduction = matchingItems.reduce((sum, i) => sum + i.stockDeductionQty, 0);
          return deduction > 0 ? { ...p, stock: Math.max(0, p.stock - deduction) } : p;
        })
      );
    }
    setSales((prev) => [sale, ...prev]);
  };

  const handleUpdateSale = (updatedSale: SaleRecord) => {
    // Restore previous stock then deduct new
    const oldSale = sales.find((s) => s.id === updatedSale.id);
    if (oldSale) {
      if (oldSale.type === 'cleaning') {
        setProducts((prev) =>
          prev.map((p) => {
            const oldMatches = oldSale.items.filter((i) => i.stockId === p.id);
            const restoreQty = oldMatches.reduce((s, i) => s + i.stockDeductionQty, 0);
            const newMatches = updatedSale.items.filter((i) => i.stockId === p.id);
            const deductQty = newMatches.reduce((s, i) => s + i.stockDeductionQty, 0);
            return { ...p, stock: Math.max(0, p.stock + restoreQty - deductQty) };
          })
        );
      } else {
        setCosProducts((prev) =>
          prev.map((p) => {
            const oldMatches = oldSale.items.filter((i) => i.stockId === p.id);
            const restoreQty = oldMatches.reduce((s, i) => s + i.stockDeductionQty, 0);
            const newMatches = updatedSale.items.filter((i) => i.stockId === p.id);
            const deductQty = newMatches.reduce((s, i) => s + i.stockDeductionQty, 0);
            return { ...p, stock: Math.max(0, p.stock + restoreQty - deductQty) };
          })
        );
      }
    }
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? updatedSale : s)));
  };

  const handleDeleteSale = (saleId: string) => {
    const sale = sales.find((s) => s.id === saleId);
    if (sale) {
      if (sale.type === 'cleaning') {
        setProducts((prev) =>
          prev.map((p) => {
            const matches = sale.items.filter((i) => i.stockId === p.id);
            const restoreQty = matches.reduce((s, i) => s + i.stockDeductionQty, 0);
            return restoreQty > 0 ? { ...p, stock: p.stock + restoreQty } : p;
          })
        );
      } else {
        setCosProducts((prev) =>
          prev.map((p) => {
            const matches = sale.items.filter((i) => i.stockId === p.id);
            const restoreQty = matches.reduce((s, i) => s + i.stockDeductionQty, 0);
            return restoreQty > 0 ? { ...p, stock: p.stock + restoreQty } : p;
          })
        );
      }
    }
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const handleEditSaleFromHistory = (sale: SaleRecord) => {
    setActiveTab('invoicing');
    setInvoicingSubTab(sale.type === 'cleaning' ? 'cleaning' : 'cosmetics');
  };

  // Handlers for Purchases & Expenses
  const handleSavePurchase = (p: PurchaseRecord) => {
    setPurchases((prev) => [p, ...prev]);
  };
  const handleDeletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };
  const handleAddSupplier = (s: Supplier) => {
    setSuppliers((prev) => [...prev, s]);
  };

  const handleSaveExpense = (e: ExpenseRecord) => {
    setExpenses((prev) => [e, ...prev]);
  };
  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };
  const handleSaveStockReturn = (ret: StockReturnRecord) => {
    setStockReturns((prev) => [ret, ...prev]);
  };

  const handleClearDayBook = (entryIds: string[]) => {
    setClearedDayBookIds((prev) => {
      const updated = [...new Set([...prev, ...entryIds])];
      try {
        localStorage.setItem('fia_cleared_daybook_ids', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save cleared ids', e);
      }
      return updated;
    });
  };

  const handleRestoreClearedDayBook = () => {
    setClearedDayBookIds([]);
    try {
      localStorage.setItem('fia_cleared_daybook_ids', JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear daybook ids', e);
    }
  };

  const handleRestoreBackup = (data: any) => {
    if (Array.isArray(data.products)) setProducts(data.products);
    if (Array.isArray(data.cosProducts)) setCosProducts(data.cosProducts);
    if (Array.isArray(data.customers)) setCustomers(data.customers);
    if (Array.isArray(data.suppliers)) setSuppliers(data.suppliers);
    if (Array.isArray(data.sales)) setSales(data.sales);
    if (Array.isArray(data.purchases)) setPurchases(data.purchases);
    if (Array.isArray(data.expenses)) setExpenses(data.expenses);
    if (Array.isArray(data.stockReturns)) setStockReturns(data.stockReturns);
    if (Array.isArray(data.clearedDayBookIds)) setClearedDayBookIds(data.clearedDayBookIds);
    if (data.appPin) {
      setAppPin(data.appPin);
      try {
        localStorage.setItem('fia_app_pin', data.appPin);
      } catch (e) {
        console.warn('Failed to save PIN in localStorage', e);
      }
    }
  };

  const handleManualSync = () => {
    setSyncStatus({ connected: true, message: 'Synchronized ✓' });
    setTimeout(() => {
      setSyncStatus({ connected: true, message: 'Local Cache Active' });
    }, 2500);
  };

  const handleLogout = () => {
    setIsUnlocked(false);
  };

  const handleNavigateTab = (tab: TabType) => {
    if (tab === 'billing') {
      setActiveTab('invoicing');
      setInvoicingSubTab('cleaning');
    } else if (tab === 'cosmetics') {
      setActiveTab('invoicing');
      setInvoicingSubTab('cosmetics');
    } else if (tab === 'history') {
      setActiveTab('invoicing');
      setInvoicingSubTab('history');
    } else {
      setActiveTab(tab);
    }
  };

  const handleUpdatePin = (newP: string) => {
    setAppPin(newP);
    try {
      localStorage.setItem('fia_app_pin', newP);
    } catch (e) {
      console.warn('Failed to save PIN in localStorage', e);
    }
  };

  // Badges & Counters
  const lowStockCount =
    products.filter((p) => Number(p.stock) <= 5).length +
    cosProducts.filter((p) => Number(p.stock) <= 5).length;

  const pendingDueCount = sales.filter((s) => s.pendingAmount > 0).length;
  const totalInvoicesCount = sales.length;

  if (!isUnlocked) {
    return (
      <PinModal
        isOpen={true}
        appPin={appPin}
        onSuccess={() => setIsUnlocked(true)}
        onUpdatePin={handleUpdatePin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">

      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBackup={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        onManualSync={handleManualSync}
        syncStatus={syncStatus}
      />

      {/* Navigation matching requested order: Dashboard -> Customers -> Billing & Invoices -> Operations & Stock -> Day Book */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleNavigateTab}
        pendingDueCount={pendingDueCount}
        lowStockCount={lowStockCount}
        totalInvoicesCount={totalInvoicesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'home' && (
          <Dashboard
            products={products}
            cosProducts={cosProducts}
            customers={customers}
            sales={sales}
            purchases={purchases}
            expenses={expenses}
            onNavigate={handleNavigateTab}
            onViewInvoice={(s) => setPreviewSale(s)}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            sales={sales}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onClearAllCustomers={handleClearAllCustomers}
            onViewInvoice={(s) => setPreviewSale(s)}
          />
        )}

        {(activeTab === 'invoicing' ||
          activeTab === 'billing' ||
          activeTab === 'cosmetics' ||
          activeTab === 'history') && (
          <InvoicingManager
            products={products}
            cosProducts={cosProducts}
            customers={customers}
            sales={sales}
            onSaveSale={handleSaveSale}
            onUpdateSale={handleUpdateSale}
            onDeleteSale={handleDeleteSale}
            onAddCustomer={handleAddCustomer}
            onViewInvoice={(s) => setPreviewSale(s)}
            onEditSale={handleEditSaleFromHistory}
            initialSubTab={invoicingSubTab}
          />
        )}

        {activeTab === 'operations' && (
          <OperationsManager
            products={products}
            cosProducts={cosProducts}
            purchases={purchases}
            suppliers={suppliers}
            expenses={expenses}
            stockReturns={stockReturns}
            onSaveProduct={handleSaveProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onSaveCosProduct={handleSaveCosProduct}
            onUpdateCosProduct={handleUpdateCosProduct}
            onDeleteCosProduct={handleDeleteCosProduct}
            onSavePurchase={handleSavePurchase}
            onDeletePurchase={handleDeletePurchase}
            onAddSupplier={handleAddSupplier}
            onSaveExpense={handleSaveExpense}
            onDeleteExpense={handleDeleteExpense}
            onSaveStockReturn={handleSaveStockReturn}
          />
        )}

        {activeTab === 'accounts' && (
          <DayBook
            sales={sales}
            purchases={purchases}
            expenses={expenses}
            clearedEntryIds={clearedDayBookIds}
            onClearDayBook={handleClearDayBook}
            onRestoreClearedDayBook={handleRestoreClearedDayBook}
            onOpenBackupModal={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      {/* Invoice Modal with PDF Download and Print */}
      <BillInvoiceModal sale={previewSale} onClose={() => setPreviewSale(null)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        appPin={appPin}
        allData={{
          products,
          cosProducts,
          customers,
          suppliers,
          sales,
          purchases,
          expenses,
          stockReturns,
          clearedDayBookIds,
          appPin,
        }}
        onClose={() => setIsSettingsOpen(false)}
        onUpdatePin={handleUpdatePin}
        onRestoreBackup={handleRestoreBackup}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}
