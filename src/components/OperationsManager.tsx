import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  BarChart3,
  Search,
  AlertCircle,
  X,
  Check,
  Save,
  Layers,
} from 'lucide-react';
import { Product, CosmeticProduct, PurchaseRecord, Supplier, ExpenseRecord, StockReturnRecord, UnitType } from '../types';
import { formatCurrency, formatDateDDMMYYYY, getTodayDateString } from '../utils/formatters';

interface OperationsManagerProps {
  products: Product[];
  cosProducts: CosmeticProduct[];
  purchases: PurchaseRecord[];
  suppliers: Supplier[];
  expenses: ExpenseRecord[];
  stockReturns: StockReturnRecord[];
  onSaveProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveCosProduct: (product: CosmeticProduct) => void;
  onUpdateCosProduct: (product: CosmeticProduct) => void;
  onDeleteCosProduct: (id: string) => void;
  onSavePurchase: (purchase: PurchaseRecord) => void;
  onDeletePurchase: (id: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
  onSaveExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  onSaveStockReturn: (stockReturn: StockReturnRecord) => void;
}

export const OperationsManager: React.FC<OperationsManagerProps> = ({
  products,
  cosProducts,
  purchases,
  suppliers,
  expenses,
  stockReturns,
  onSaveProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSaveCosProduct,
  onUpdateCosProduct,
  onDeleteCosProduct,
  onSavePurchase,
  onDeletePurchase,
  onAddSupplier,
  onSaveExpense,
  onDeleteExpense,
  onSaveStockReturn,
}) => {
  const [mainTab, setMainTab] = useState<'stock' | 'purchases' | 'expenses'>('stock');
  const [stockCategory, setStockCategory] = useState<'cleaning' | 'cosmetics'>('cleaning');
  const [stockActionTab, setStockActionTab] = useState<'add' | 'view' | 'return' | 'consolidated'>('add');

  // Dedicated Modal States for View Stock Edit & Delete
  const [editingStockItem, setEditingStockItem] = useState<{
    type: 'cleaning' | 'cosmetics';
    id: string;
    name: string;
    barcode: string;
    stock: number;
    unit: UnitType;
    price1: number; // Wholesale or Cost Price
    price2: number; // Retail or Sale Price
  } | null>(null);

  const [deletingStockItem, setDeletingStockItem] = useState<{
    type: 'cleaning' | 'cosmetics';
    id: string;
    name: string;
    stock: number;
    unit: string;
  } | null>(null);

  // Product Form states
  const [editingCleanId, setEditingCleanId] = useState<string | null>(null);
  const [cleanName, setCleanName] = useState('');
  const [cleanBarcode, setCleanBarcode] = useState('');
  const [cleanStock, setCleanStock] = useState<number>(0);
  const [cleanUnit, setCleanUnit] = useState<UnitType>('Ltr');
  const [cleanWholesale, setCleanWholesale] = useState<number>(0);
  const [cleanRetail, setCleanRetail] = useState<number>(0);

  // Add stock to existing
  const [addStockProdId, setAddStockProdId] = useState('');
  const [addStockQty, setAddStockQty] = useState<number>(0);

  // Cosmetic Product Form
  const [editingCosId, setEditingCosId] = useState<string | null>(null);
  const [cosName, setCosName] = useState('');
  const [cosBarcode, setCosBarcode] = useState('');
  const [cosStock, setCosStock] = useState<number>(0);
  const [cosUnit, setCosUnit] = useState<UnitType>('Bottle');
  const [cosCost, setCosCost] = useState<number>(0);
  const [cosSale, setCosSale] = useState<number>(0);

  // Purchase Form states
  const [purchSupplierName, setPurchSupplierName] = useState('');
  const [purchSupplierMobile, setPurchSupplierMobile] = useState('');
  const [purchType, setPurchType] = useState<'cleaning' | 'cosmetics'>('cleaning');
  const [purchStockId, setPurchStockId] = useState('');
  const [purchItemName, setPurchItemName] = useState('');
  const [purchBarcode, setPurchBarcode] = useState('');
  const [purchQty, setPurchQty] = useState<number>(0);
  const [purchUnit, setPurchUnit] = useState<UnitType>('Ltr');
  const [purchUnitPrice, setPurchUnitPrice] = useState<number>(0);
  const [purchTotalCost, setPurchTotalCost] = useState<number>(0);
  const [purchPaid, setPurchPaid] = useState<number>(0);
  const [purchDate, setPurchDate] = useState(getTodayDateString());

  // Supplier quick add
  const [newSupName, setNewSupName] = useState('');
  const [newSupMobile, setNewSupMobile] = useState('');

  // Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expDate, setExpDate] = useState(getTodayDateString());

  // Stock Return Form
  const [retProductId, setRetProductId] = useState('');
  const [retCustomer, setRetCustomer] = useState('');
  const [retQty, setRetQty] = useState<number>(0);
  const [retCondition, setRetCondition] = useState<'Usable' | 'Damaged'>('Usable');
  const [retReason, setRetReason] = useState('');

  // Search filter
  const [stockSearchQuery, setStockSearchQuery] = useState('');

  // Auto calculate purchase total
  const handlePurchaseQtyPriceChange = (q: number, price: number) => {
    setPurchQty(q);
    setPurchUnitPrice(price);
    const total = Number((q * price).toFixed(2));
    setPurchTotalCost(total);
    setPurchPaid(total);
  };

  // Save Cleaning Product
  const handleSaveCleanProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanName.trim()) return;

    const prod: Product = {
      id: editingCleanId || 'prod_' + Date.now(),
      name: cleanName.trim(),
      barcode: cleanBarcode.trim() || undefined,
      stock: Number(cleanStock || 0),
      unit: cleanUnit,
      wholesalePrice: Number(cleanWholesale || 0),
      retailPrice: Number(cleanRetail || 0),
    };

    if (editingCleanId) {
      onUpdateProduct(prod);
      alert('Product updated successfully!');
    } else {
      onSaveProduct(prod);
      alert('Product added to inventory!');
    }

    setEditingCleanId(null);
    setCleanName('');
    setCleanBarcode('');
    setCleanStock(0);
    setCleanWholesale(0);
    setCleanRetail(0);
  };

  const handleEditCleanProduct = (p: Product) => {
    setEditingCleanId(p.id);
    setCleanName(p.name);
    setCleanBarcode(p.barcode || '');
    setCleanStock(p.stock);
    setCleanUnit(p.unit);
    setCleanWholesale(p.wholesalePrice);
    setCleanRetail(p.retailPrice);
    setStockActionTab('add');
  };

  const handleAddStockQuick = () => {
    if (!addStockProdId || addStockQty <= 0) {
      alert('Please choose a product and enter a positive quantity.');
      return;
    }
    const p = products.find((x) => x.id === addStockProdId);
    if (!p) return;
    onUpdateProduct({ ...p, stock: p.stock + addStockQty });
    alert(`Added ${addStockQty} ${p.unit} to ${p.name}!`);
    setAddStockQty(0);
    setAddStockProdId('');
  };

  // View Stock Modal Handlers for Edit and Delete
  const openEditCleanStock = (p: Product) => {
    setEditingStockItem({
      type: 'cleaning',
      id: p.id,
      name: p.name,
      barcode: p.barcode || '',
      stock: p.stock,
      unit: p.unit,
      price1: p.wholesalePrice,
      price2: p.retailPrice,
    });
  };

  const openEditCosStock = (p: CosmeticProduct) => {
    setEditingStockItem({
      type: 'cosmetics',
      id: p.id,
      name: p.name,
      barcode: p.barcode || '',
      stock: p.stock,
      unit: p.unit,
      price1: p.costPrice,
      price2: p.salePrice,
    });
  };

  const handleSaveStockModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStockItem || !editingStockItem.name.trim()) return;

    if (editingStockItem.type === 'cleaning') {
      onUpdateProduct({
        id: editingStockItem.id,
        name: editingStockItem.name.trim(),
        barcode: editingStockItem.barcode.trim() || undefined,
        stock: Number(editingStockItem.stock || 0),
        unit: editingStockItem.unit,
        wholesalePrice: Number(editingStockItem.price1 || 0),
        retailPrice: Number(editingStockItem.price2 || 0),
      });
    } else {
      onUpdateCosProduct({
        id: editingStockItem.id,
        name: editingStockItem.name.trim(),
        barcode: editingStockItem.barcode.trim() || undefined,
        stock: Number(editingStockItem.stock || 0),
        unit: editingStockItem.unit,
        costPrice: Number(editingStockItem.price1 || 0),
        salePrice: Number(editingStockItem.price2 || 0),
      });
    }
    setEditingStockItem(null);
  };

  const handleConfirmDeleteStock = () => {
    if (!deletingStockItem) return;
    if (deletingStockItem.type === 'cleaning') {
      onDeleteProduct(deletingStockItem.id);
    } else {
      onDeleteCosProduct(deletingStockItem.id);
    }
    setDeletingStockItem(null);
  };

  // Save Cosmetic Product
  const handleSaveCosProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cosName.trim()) return;

    const prod: CosmeticProduct = {
      id: editingCosId || 'cprod_' + Date.now(),
      name: cosName.trim(),
      barcode: cosBarcode.trim() || undefined,
      stock: Number(cosStock || 0),
      unit: cosUnit,
      costPrice: Number(cosCost || 0),
      salePrice: Number(cosSale || 0),
    };

    if (editingCosId) {
      onUpdateCosProduct(prod);
      alert('Cosmetic product updated!');
    } else {
      onSaveCosProduct(prod);
      alert('Cosmetic product saved!');
    }

    setEditingCosId(null);
    setCosName('');
    setCosBarcode('');
    setCosStock(0);
    setCosCost(0);
    setCosSale(0);
  };

  const handleEditCosProduct = (p: CosmeticProduct) => {
    setEditingCosId(p.id);
    setCosName(p.name);
    setCosBarcode(p.barcode || '');
    setCosStock(p.stock);
    setCosUnit(p.unit);
    setCosCost(p.costPrice);
    setCosSale(p.salePrice);
    setStockActionTab('add');
  };

  // Save Purchase
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchSupplierName.trim()) {
      alert('Please enter supplier name.');
      return;
    }
    const rawMaterialName = purchStockId
      ? (purchType === 'cleaning'
          ? products.find((p) => p.id === purchStockId)?.name
          : cosProducts.find((p) => p.id === purchStockId)?.name) || purchItemName
      : purchItemName;

    if (!rawMaterialName) {
      alert('Please choose or enter a product name.');
      return;
    }

    const purchRecord: PurchaseRecord = {
      id: 'purch_' + Date.now(),
      type: purchType,
      supplierName: purchSupplierName.trim(),
      supplierMobile: purchSupplierMobile.trim() || undefined,
      rawMaterial: rawMaterialName,
      stockId: purchStockId || undefined,
      rawBarcode: purchBarcode.trim() || undefined,
      rawQty: Number(purchQty || 0),
      rawUnit: purchUnit,
      rawUnitPrice: Number(purchUnitPrice || 0),
      rawCost: Number(purchTotalCost || 0),
      paid: Number(purchPaid || 0),
      balance: Math.max(0, Number(purchTotalCost || 0) - Number(purchPaid || 0)),
      date: purchDate,
      savedAt: Date.now(),
      returns: [],
    };

    onSavePurchase(purchRecord);

    // If linked to existing stock product, increment stock!
    if (purchStockId) {
      if (purchType === 'cleaning') {
        const prod = products.find((p) => p.id === purchStockId);
        if (prod) onUpdateProduct({ ...prod, stock: prod.stock + Number(purchQty || 0) });
      } else {
        const cprod = cosProducts.find((p) => p.id === purchStockId);
        if (cprod) onUpdateCosProduct({ ...cprod, stock: cprod.stock + Number(purchQty || 0) });
      }
    }

    alert('Purchase saved and inventory updated!');
    setPurchSupplierName('');
    setPurchSupplierMobile('');
    setPurchStockId('');
    setPurchItemName('');
    setPurchBarcode('');
    setPurchQty(0);
    setPurchUnitPrice(0);
    setPurchTotalCost(0);
    setPurchPaid(0);
  };

  // Add Supplier quick
  const handleAddSupplierQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;
    onAddSupplier({
      id: 'sup_' + Date.now(),
      name: newSupName.trim(),
      mobile: newSupMobile.trim(),
    });
    alert(`Supplier ${newSupName} added!`);
    setNewSupName('');
    setNewSupMobile('');
  };

  // Save Expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || expAmount <= 0) {
      alert('Please enter expense title and valid amount.');
      return;
    }
    onSaveExpense({
      id: 'exp_' + Date.now(),
      title: expTitle.trim(),
      amount: Number(expAmount),
      date: expDate,
      savedAt: Date.now(),
    });
    alert('Expense recorded!');
    setExpTitle('');
    setExpAmount(0);
  };

  // Save Stock Return
  const handleSaveReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retProductId || retQty <= 0) {
      alert('Please select product and enter valid return quantity.');
      return;
    }
    const isClean = stockCategory === 'cleaning';
    const prod = isClean
      ? products.find((p) => p.id === retProductId)
      : cosProducts.find((p) => p.id === retProductId);

    if (!prod) return;

    if (retCondition === 'Usable') {
      if (isClean) {
        onUpdateProduct({ ...(prod as Product), stock: prod.stock + retQty });
      } else {
        onUpdateCosProduct({ ...(prod as CosmeticProduct), stock: prod.stock + retQty });
      }
    }

    onSaveStockReturn({
      id: 'ret_' + Date.now(),
      type: stockCategory,
      productId: prod.id,
      productName: prod.name,
      unit: prod.unit,
      customer: retCustomer.trim() || undefined,
      qty: retQty,
      condition: retCondition,
      reason: retReason.trim() || undefined,
      date: getTodayDateString(),
      savedAt: Date.now(),
    });

    alert(
      retCondition === 'Usable'
        ? `Returned ${retQty} ${prod.unit} back to usable stock.`
        : `Recorded ${retQty} ${prod.unit} as damaged stock.`
    );
    setRetProductId('');
    setRetCustomer('');
    setRetQty(0);
    setRetReason('');
  };

  return (
    <div className="space-y-6">
      {/* Main Operations Tabs */}
      <div className="flex bg-slate-200 p-1 rounded-lg max-w-md">
        <button
          onClick={() => setMainTab('stock')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
            mainTab === 'stock' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📦 Stock Inventory
        </button>
        <button
          onClick={() => setMainTab('purchases')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
            mainTab === 'purchases' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🛒 Purchases
        </button>
        <button
          onClick={() => setMainTab('expenses')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
            mainTab === 'expenses' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💸 Expenses
        </button>
      </div>

      {/* ================= SECTION 1: STOCK MANAGEMENT ================= */}
      {mainTab === 'stock' && (
        <div className="space-y-6">
          {/* Cleaning vs Cosmetics Sub tabs */}
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setStockCategory('cleaning')}
                className={`px-4 py-2 rounded text-xs font-bold transition ${
                  stockCategory === 'cleaning'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🧹 Cleaning Stock ({products.length})
              </button>
              <button
                onClick={() => setStockCategory('cosmetics')}
                className={`px-4 py-2 rounded text-xs font-bold transition ${
                  stockCategory === 'cosmetics'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                💄 Cosmetics Stock ({cosProducts.length})
              </button>
            </div>

            {/* Stock Action Sub-Tabs */}
            <div className="flex gap-1">
              {[
                { id: 'add', label: '➕ Add Stock' },
                { id: 'view', label: '👁️ View List' },
                { id: 'return', label: '↩️ Returns' },
                { id: 'consolidated', label: '📊 Consolidated' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStockActionTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    stockActionTab === tab.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ADD STOCK TAB */}
          {stockActionTab === 'add' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Product Form */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  {stockCategory === 'cleaning'
                    ? editingCleanId
                      ? 'Edit Cleaning Product'
                      : 'Add New Cleaning Product'
                    : editingCosId
                    ? 'Edit Cosmetic Product'
                    : 'Add New Cosmetic Product'}
                </h3>

                {stockCategory === 'cleaning' ? (
                  <form onSubmit={handleSaveCleanProduct} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Dish Wash Concentrate"
                        value={cleanName}
                        onChange={(e) => setCleanName(e.target.value)}
                        required
                        className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Opening Stock</label>
                        <input
                          type="number"
                          value={cleanStock || ''}
                          onChange={(e) => setCleanStock(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Stock Unit</label>
                        <select
                          value={cleanUnit}
                          onChange={(e) => setCleanUnit(e.target.value as UnitType)}
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none bg-white"
                        >
                          <option value="Ltr">Litre (Ltr)</option>
                          <option value="Kg">Kilogram (Kg)</option>
                          <option value="Gram">Gram (g)</option>
                          <option value="ml">Millilitre (ml)</option>
                          <option value="Pcs">Pieces (Pcs)</option>
                          <option value="Bottle">Bottle</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Wholesale Rate (₹)</label>
                        <input
                          type="number"
                          value={cleanWholesale || ''}
                          onChange={(e) => setCleanWholesale(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Retail Rate (₹)</label>
                        <input
                          type="number"
                          value={cleanRetail || ''}
                          onChange={(e) => setCleanRetail(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold text-indigo-700 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded font-bold text-xs shadow transition"
                      >
                        {editingCleanId ? 'Update Product' : 'Save Product'}
                      </button>
                      {editingCleanId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCleanId(null);
                            setCleanName('');
                            setCleanStock(0);
                            setCleanWholesale(0);
                            setCleanRetail(0);
                          }}
                          className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded text-xs font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  /* Cosmetic Product Form */
                  <form onSubmit={handleSaveCosProduct} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Cosmetic Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Herbal Hair Oil 200ml"
                        value={cosName}
                        onChange={(e) => setCosName(e.target.value)}
                        required
                        className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Opening Stock</label>
                        <input
                          type="number"
                          value={cosStock || ''}
                          onChange={(e) => setCosStock(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold focus:border-pink-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Unit</label>
                        <select
                          value={cosUnit}
                          onChange={(e) => setCosUnit(e.target.value as UnitType)}
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-pink-500 outline-none bg-white"
                        >
                          <option value="Bottle">Bottle</option>
                          <option value="Pcs">Pieces</option>
                          <option value="Ltr">Litre</option>
                          <option value="ml">ml</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Cost Price (₹)</label>
                        <input
                          type="number"
                          value={cosCost || ''}
                          onChange={(e) => setCosCost(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono focus:border-pink-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Sale Price (₹)</label>
                        <input
                          type="number"
                          value={cosSale || ''}
                          onChange={(e) => setCosSale(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="any"
                          className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold text-pink-700 focus:border-pink-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded font-bold text-xs shadow transition"
                      >
                        {editingCosId ? 'Update Cosmetic' : 'Save Cosmetic'}
                      </button>
                      {editingCosId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCosId(null);
                            setCosName('');
                            setCosStock(0);
                            setCosCost(0);
                            setCosSale(0);
                          }}
                          className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded text-xs font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Quick Add Stock To Existing */}
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  ➕ Fast Add Stock to Existing Product
                </h3>
                <p className="text-xs text-slate-500">
                  Quickly add incoming batch quantity directly to existing product stock.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Select Product</label>
                    <select
                      value={addStockProdId}
                      onChange={(e) => setAddStockProdId(e.target.value)}
                      className="w-full border-2 border-slate-200 bg-white p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Current: {p.stock} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Quantity to Add</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={addStockQty || ''}
                      onChange={(e) => setAddStockQty(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="any"
                      className="w-full border-2 border-slate-200 bg-white p-2.5 rounded-md text-xs font-mono font-bold focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStockQuick}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded font-bold text-xs shadow transition"
                  >
                    + ADD STOCK TO INVENTORY
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW STOCK LIST TAB */}
          {stockActionTab === 'view' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span>View & Manage Stock</span>
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    {stockCategory === 'cleaning'
                      ? `${products.length} Cleaning Items`
                      : `${cosProducts.length} Cosmetic Items`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category switcher directly inside View Stock */}
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStockCategory('cleaning')}
                      className={`text-xs px-3 py-1 rounded font-bold transition ${
                        stockCategory === 'cleaning'
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cleaning Stock ({products.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockCategory('cosmetics')}
                      className={`text-xs px-3 py-1 rounded font-bold transition ${
                        stockCategory === 'cosmetics'
                          ? 'bg-white text-pink-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cosmetic Stock ({cosProducts.length})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search stock..."
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stockCategory === 'cleaning' ? (
                  products.filter((p) => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase())).length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      No cleaning products found. Click <strong>"Add / Edit Product"</strong> to register your products.
                    </div>
                  ) : (
                    products
                      .filter((p) => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()))
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition space-y-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">{p.name}</h4>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold shrink-0">
                                Cleaning
                              </span>
                            </div>

                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-xs text-slate-500">Available:</span>
                              <span
                                className={`text-lg font-mono font-bold ${
                                  p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'
                                }`}
                              >
                                {p.stock} {p.unit}
                              </span>
                              {p.stock <= 5 && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                                  LOW STOCK
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100 flex justify-between">
                              <span>Wholesale: ₹{p.wholesalePrice}</span>
                              <span className="text-indigo-700 font-bold">Retail: ₹{p.retailPrice}</span>
                            </div>
                            {p.barcode && (
                              <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                                Barcode: {p.barcode}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Edit Stock & Delete Stock */}
                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => openEditCleanStock(p)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 px-2 rounded-md text-xs font-bold transition border border-indigo-200 shadow-2xs"
                              title="Edit Stock details and quantity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Stock</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingStockItem({
                                  type: 'cleaning',
                                  id: p.id,
                                  name: p.name,
                                  stock: p.stock,
                                  unit: p.unit,
                                })
                              }
                              className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-1.5 px-2.5 rounded-md text-xs font-bold transition border border-rose-200 shadow-2xs"
                              title="Delete Stock Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )
                ) : (
                  cosProducts.filter((p) => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase())).length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      No cosmetic products found. Click <strong>"Add / Edit Product"</strong> to register your products.
                    </div>
                  ) : (
                    cosProducts
                      .filter((p) => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()))
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-lg border border-slate-200 bg-white hover:border-pink-300 hover:shadow-xs transition space-y-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">{p.name}</h4>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-bold shrink-0">
                                Cosmetics
                              </span>
                            </div>

                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-xs text-slate-500">Available:</span>
                              <span
                                className={`text-lg font-mono font-bold ${
                                  p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'
                                }`}
                              >
                                {p.stock} {p.unit}
                              </span>
                              {p.stock <= 5 && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                                  LOW STOCK
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100 flex justify-between">
                              <span>Cost: ₹{p.costPrice}</span>
                              <span className="text-pink-700 font-bold">Sale: ₹{p.salePrice}</span>
                            </div>
                            {p.barcode && (
                              <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                                Barcode: {p.barcode}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Edit Stock & Delete Stock */}
                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => openEditCosStock(p)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 py-1.5 px-2 rounded-md text-xs font-bold transition border border-pink-200 shadow-2xs"
                              title="Edit Cosmetic Stock details and quantity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Stock</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingStockItem({
                                  type: 'cosmetics',
                                  id: p.id,
                                  name: p.name,
                                  stock: p.stock,
                                  unit: p.unit,
                                })
                              }
                              className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-1.5 px-2.5 rounded-md text-xs font-bold transition border border-rose-200 shadow-2xs"
                              title="Delete Stock Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )
                )}
              </div>
            </div>
          )}

          {/* STOCK RETURNS TAB */}
          {stockActionTab === 'return' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  ↩️ Record Customer Return Stock
                </h3>
                <form onSubmit={handleSaveReturn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Product</label>
                    <select
                      value={retProductId}
                      onChange={(e) => setRetProductId(e.target.value)}
                      required
                      className="w-full border-2 border-slate-200 bg-white p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none"
                    >
                      <option value="">-- Select Product to Return --</option>
                      {(stockCategory === 'cleaning' ? products : cosProducts).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Current: {p.stock} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Return Qty</label>
                      <input
                        type="number"
                        value={retQty || ''}
                        onChange={(e) => setRetQty(parseFloat(e.target.value) || 0)}
                        min="0.1"
                        step="any"
                        required
                        className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Condition</label>
                      <select
                        value={retCondition}
                        onChange={(e) => setRetCondition(e.target.value as any)}
                        className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none bg-white"
                      >
                        <option value="Usable">🟢 Usable (Add back to stock)</option>
                        <option value="Damaged">🔴 Damaged (Do not add)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Customer / Party Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul K."
                      value={retCustomer}
                      onChange={(e) => setRetCustomer(e.target.value)}
                      className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Reason / Remarks</label>
                    <input
                      type="text"
                      placeholder="Optional reason..."
                      value={retReason}
                      onChange={(e) => setRetReason(e.target.value)}
                      className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded font-bold text-xs shadow transition"
                  >
                    RECORD STOCK RETURN
                  </button>
                </form>
              </div>

              {/* Returns History */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Return History
                </h3>
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
                  {stockReturns.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No returns recorded yet.</p>
                  ) : (
                    stockReturns
                      .slice()
                      .reverse()
                      .map((ret) => (
                        <div
                          key={ret.id}
                          className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{ret.productName}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                ret.condition === 'Usable'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ret.condition}
                            </span>
                          </div>
                          <p className="text-slate-500">
                            {ret.qty} {ret.unit} • {formatDateDDMMYYYY(ret.date)} • {ret.customer || 'No customer'}
                          </p>
                          {ret.reason && <p className="text-[11px] text-slate-600 italic">"{ret.reason}"</p>}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONSOLIDATED STOCK REPORT TAB */}
          {stockActionTab === 'consolidated' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                📊 Consolidated Stock Report (Cleaning + Cosmetics)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Product Name</th>
                      <th className="p-2.5 text-right">Available Stock</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5">Barcode</th>
                      <th className="p-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ...products.map((p) => ({ ...p, category: 'Cleaning' })),
                      ...cosProducts.map((p) => ({ ...p, category: 'Cosmetics' })),
                    ]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-2.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                p.category === 'Cleaning'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-pink-50 text-pink-700'
                              }`}
                            >
                              {p.category}
                            </span>
                          </td>
                          <td className="p-2.5 font-semibold text-slate-900">{p.name}</td>
                          <td
                            className={`p-2.5 text-right font-mono font-bold ${
                              p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {p.stock}
                          </td>
                          <td className="p-2.5 font-mono text-slate-500">{p.unit}</td>
                          <td className="p-2.5 font-mono text-slate-400">{p.barcode || '—'}</td>
                          <td className="p-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (p.category === 'Cleaning') {
                                    const item = products.find((x) => x.id === p.id);
                                    if (item) openEditCleanStock(item);
                                  } else {
                                    const item = cosProducts.find((x) => x.id === p.id);
                                    if (item) openEditCosStock(item);
                                  }
                                }}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition"
                                title="Edit Stock"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingStockItem({
                                    type: p.category === 'Cleaning' ? 'cleaning' : 'cosmetics',
                                    id: p.id,
                                    name: p.name,
                                    stock: p.stock,
                                    unit: p.unit,
                                  })
                                }
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Delete Stock"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 2: PURCHASES ================= */}
      {mainTab === 'purchases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase Form */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Add Supplier */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                👤 Add Supplier
              </h4>
              <form onSubmit={handleAddSupplierQuick} className="space-y-2">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2 rounded text-xs focus:border-indigo-500 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={newSupMobile}
                  onChange={(e) => setNewSupMobile(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2 rounded text-xs font-mono focus:border-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-xs font-bold shadow-xs transition"
                >
                  + ADD SUPPLIER
                </button>
              </form>
            </div>

            {/* New Purchase Entry */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                🛒 New Purchase Entry
              </h3>

              <form onSubmit={handleSavePurchase} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Supplier</label>
                  <select
                    value={purchSupplierName}
                    onChange={(e) => {
                      setPurchSupplierName(e.target.value);
                      const s = suppliers.find((x) => x.name === e.target.value);
                      if (s) setPurchSupplierMobile(s.mobile || '');
                    }}
                    className="w-full border-2 border-slate-200 bg-white p-2 rounded text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Choose Supplier / Or Type Below --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.mobile || 'No mobile'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Supplier Name (Manual)</label>
                  <input
                    type="text"
                    placeholder="Supplier Name"
                    value={purchSupplierName}
                    onChange={(e) => setPurchSupplierName(e.target.value)}
                    required
                    className="w-full border-2 border-slate-200 p-2 rounded text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category & Stock Link</label>
                  <div className="flex gap-2">
                    <select
                      value={purchType}
                      onChange={(e) => {
                        setPurchType(e.target.value as any);
                        setPurchStockId('');
                      }}
                      className="w-1/2 border border-slate-200 bg-white p-2 rounded text-xs"
                    >
                      <option value="cleaning">🧹 Cleaning</option>
                      <option value="cosmetics">💄 Cosmetics</option>
                    </select>

                    <select
                      value={purchStockId}
                      onChange={(e) => {
                        setPurchStockId(e.target.value);
                        if (e.target.value) {
                          const p =
                            purchType === 'cleaning'
                              ? products.find((x) => x.id === e.target.value)
                              : cosProducts.find((x) => x.id === e.target.value);
                          if (p) {
                            setPurchUnit(p.unit);
                            setPurchBarcode(p.barcode || '');
                          }
                        }
                      }}
                      className="w-1/2 border border-slate-200 bg-white p-2 rounded text-xs"
                    >
                      <option value="">-- Link to Stock --</option>
                      {(purchType === 'cleaning' ? products : cosProducts).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!purchStockId && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Product / Material Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Raw Concentrate"
                      value={purchItemName}
                      onChange={(e) => setPurchItemName(e.target.value)}
                      required={!purchStockId}
                      className="w-full border-2 border-slate-200 p-2 rounded text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Quantity</label>
                    <input
                      type="number"
                      value={purchQty || ''}
                      onChange={(e) =>
                        handlePurchaseQtyPriceChange(
                          parseFloat(e.target.value) || 0,
                          purchUnitPrice
                        )
                      }
                      min="0.1"
                      step="any"
                      required
                      className="w-full border border-slate-200 p-2 rounded text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Unit Price (₹)</label>
                    <input
                      type="number"
                      value={purchUnitPrice || ''}
                      onChange={(e) =>
                        handlePurchaseQtyPriceChange(
                          purchQty,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="any"
                      className="w-full border border-slate-200 p-2 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Total Cost (₹)</label>
                    <input
                      type="number"
                      value={purchTotalCost || ''}
                      onChange={(e) => setPurchTotalCost(parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-200 p-2 rounded text-xs font-mono font-bold text-blue-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Paid Amount (₹)</label>
                    <input
                      type="number"
                      value={purchPaid || ''}
                      onChange={(e) => setPurchPaid(parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-200 p-2 rounded text-xs font-mono font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded font-bold text-xs shadow transition"
                >
                  SAVE PURCHASE
                </button>
              </form>
            </div>
          </div>

          {/* Purchase History List (Descending) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              📋 Purchase History (Newest First)
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {purchases.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No purchases recorded yet.
                </div>
              ) : (
                [...purchases]
                  .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:border-blue-300 transition space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-blue-900">
                            {p.supplierName} — {p.rawMaterial}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {formatDateDDMMYYYY(p.date)} • Qty: {p.rawQty} {p.rawUnit}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Delete purchase record?`)) onDeletePurchase(p.id);
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <span className="font-mono font-bold text-slate-900">
                          Total: {formatCurrency(p.rawCost)}
                        </span>
                        <span className="font-mono text-emerald-600">
                          Paid: {formatCurrency(p.paid)}
                        </span>
                        {p.balance > 0 ? (
                          <span className="font-mono font-bold text-rose-600">
                            Bal: {formatCurrency(p.balance)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Cleared</span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: EXPENSES ================= */}
      {mainTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              💸 Record Business Expense
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Shop Rent, Electricity, Freight"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  required
                  className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-rose-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={expAmount || ''}
                  onChange={(e) => setExpAmount(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="any"
                  required
                  className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono font-bold text-rose-600 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded text-xs font-mono focus:border-rose-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded font-bold text-xs shadow transition"
              >
                SAVE EXPENSE
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Expense History
            </h3>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {expenses.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No expenses recorded yet.
                </div>
              ) : (
                [...expenses]
                  .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
                  .map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded border border-slate-200 bg-rose-50/20 flex justify-between items-center text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{ex.title}</h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {formatDateDDMMYYYY(ex.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-rose-600 text-sm">
                          {formatCurrency(ex.amount)}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Delete expense "${ex.title}"?`)) onDeleteExpense(ex.id);
                          }}
                          className="text-rose-400 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT STOCK MODAL ================= */}
      {editingStockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Edit Stock Item</h3>
                  <p className="text-[11px] text-slate-400">
                    {editingStockItem.type === 'cleaning' ? 'Cleaning Inventory' : 'Cosmetic Inventory'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStockItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStockModal} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingStockItem.name}
                  onChange={(e) =>
                    setEditingStockItem({ ...editingStockItem, name: e.target.value })
                  }
                  className="w-full border-2 border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Available Stock *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingStockItem.stock}
                    onChange={(e) =>
                      setEditingStockItem({
                        ...editingStockItem,
                        stock: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border-2 border-indigo-200 bg-indigo-50/50 rounded-md p-2.5 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stock Unit</label>
                  <select
                    value={editingStockItem.unit}
                    onChange={(e) =>
                      setEditingStockItem({
                        ...editingStockItem,
                        unit: e.target.value as UnitType,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="Ltr">Ltr (Liter)</option>
                    <option value="ml">ml (Milliliter)</option>
                    <option value="Kg">Kg (Kilogram)</option>
                    <option value="Gram">Gram</option>
                    <option value="mg">mg (Milligram)</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              {/* Quick stock adjustment buttons */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Quick Adjust:
                </span>
                {[-10, -5, -1, 1, 5, 10].map((adj) => (
                  <button
                    key={adj}
                    type="button"
                    onClick={() =>
                      setEditingStockItem({
                        ...editingStockItem,
                        stock: Math.max(0, Number((editingStockItem.stock + adj).toFixed(3))),
                      })
                    }
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition ${
                      adj > 0
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {adj > 0 ? `+${adj}` : adj}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {editingStockItem.type === 'cleaning' ? 'Wholesale Price (₹)' : 'Cost Price (₹)'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={editingStockItem.price1 || ''}
                    onChange={(e) =>
                      setEditingStockItem({
                        ...editingStockItem,
                        price1: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-md p-2.5 text-xs font-mono font-bold focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {editingStockItem.type === 'cleaning' ? 'Retail Price (₹)' : 'Sale Price (₹)'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={editingStockItem.price2 || ''}
                    onChange={(e) =>
                      setEditingStockItem({
                        ...editingStockItem,
                        price2: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-md p-2.5 text-xs font-mono font-bold text-indigo-700 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>Barcode / Code</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 890123456"
                  value={editingStockItem.barcode}
                  onChange={(e) =>
                    setEditingStockItem({ ...editingStockItem, barcode: e.target.value })
                  }
                  className="w-full border-2 border-slate-200 rounded-md p-2 text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStockItem(null)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE STOCK CONFIRMATION DIALOG ================= */}
      {deletingStockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Stock Item?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900">"{deletingStockItem.name}"</strong>?
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
                Current Stock: <strong className="text-slate-900">{deletingStockItem.stock} {deletingStockItem.unit}</strong>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">
                This item will be removed from inventory and billing selection.
              </p>
            </div>

            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingStockItem(null)}
                className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStock}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
