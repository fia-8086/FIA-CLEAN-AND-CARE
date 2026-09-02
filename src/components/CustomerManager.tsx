import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Phone,
  Share2,
  AlertTriangle,
  X,
  Check,
  UserCheck,
  Building,
} from 'lucide-react';
import { CustomerProfile, SaleRecord } from '../types';
import { formatCurrency, formatDateDDMMYYYY } from '../utils/formatters';

interface CustomerManagerProps {
  customers: CustomerProfile[];
  sales: SaleRecord[];
  onAddCustomer: (customer: CustomerProfile) => void;
  onUpdateCustomer: (customer: CustomerProfile) => void;
  onDeleteCustomer: (customerId: string) => void;
  onClearAllCustomers?: () => void;
  onViewInvoice: (sale: SaleRecord) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers,
  sales,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onClearAllCustomers,
  onViewInvoice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'consolidation'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // In-app Delete Confirmation Modal (Bypasses browser window.confirm iframe blocks)
  const [customerToDelete, setCustomerToDelete] = useState<CustomerProfile | null>(null);
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  const handleConfirmClearAll = () => {
    if (onClearAllCustomers) {
      onClearAllCustomers();
    }
    setIsConfirmingClearAll(false);
    setEditingCustomerId(null);
    setName('');
    setPhone('');
    setFormSuccessMessage('All customer profiles cleared successfully.');
    setTimeout(() => setFormSuccessMessage(null), 3000);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a customer name.');
      return;
    }

    if (editingCustomerId) {
      const existing = customers.find((c) => c.id === editingCustomerId);
      if (existing) {
        onUpdateCustomer({ ...existing, name: name.trim(), phone: phone.trim() });
        setFormSuccessMessage(`Updated customer "${name.trim()}" successfully!`);
      }
    } else {
      onAddCustomer({
        id: 'cust_' + Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      });
      setFormSuccessMessage(`Customer "${name.trim()}" added to directory!`);
    }

    setName('');
    setPhone('');
    setEditingCustomerId(null);

    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 3000);
  };

  const handleEdit = (c: CustomerProfile) => {
    setEditingCustomerId(c.id);
    setName(c.name);
    setPhone(c.phone || '');
    setActiveSubTab('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = () => {
    if (!customerToDelete) return;
    onDeleteCustomer(customerToDelete.id);
    if (editingCustomerId === customerToDelete.id) {
      setEditingCustomerId(null);
      setName('');
      setPhone('');
    }
    setCustomerToDelete(null);
  };

  // Filtered customer directory
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  // Group sales by customer name for Consolidation
  const customerSummaryMap = new Map<
    string,
    {
      name: string;
      phone: string;
      totalPurchases: number;
      totalPaid: number;
      totalDue: number;
      bills: SaleRecord[];
    }
  >();

  // Initialize with known customers
  customers.forEach((c) => {
    customerSummaryMap.set(c.name.trim().toLowerCase(), {
      name: c.name,
      phone: c.phone || '',
      totalPurchases: 0,
      totalPaid: 0,
      totalDue: 0,
      bills: [],
    });
  });

  // Accumulate sales
  sales.forEach((s) => {
    const key = (s.name || '').trim().toLowerCase();
    if (!key) return;
    if (!customerSummaryMap.has(key)) {
      customerSummaryMap.set(key, {
        name: s.name,
        phone: s.phone || '',
        totalPurchases: 0,
        totalPaid: 0,
        totalDue: 0,
        bills: [],
      });
    }
    const entry = customerSummaryMap.get(key)!;
    if (s.phone && !entry.phone) entry.phone = s.phone;
    entry.totalPurchases += s.grandTotal || 0;
    entry.totalPaid += s.paidAmount || 0;
    entry.totalDue += s.pendingAmount || 0;
    entry.bills.push(s);
  });

  const consolidationList = Array.from(customerSummaryMap.values())
    .filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.phone && entry.phone.includes(searchQuery))
    )
    .sort((a, b) => b.totalPurchases - a.totalPurchases);

  // WhatsApp share statement
  const shareCustomerStatementWhatsApp = (customerData: typeof consolidationList[0]) => {
    const billsList = customerData.bills
      .map(
        (b, i) =>
          `${i + 1}. *Bill #${b.billNo}* (${formatDateDDMMYYYY(b.date)}) - Total: ₹${b.grandTotal.toFixed(
            2
          )} | Paid: ₹${b.paidAmount.toFixed(2)}${
            b.pendingAmount > 0 ? ` | Due: ₹${b.pendingAmount.toFixed(2)}` : ''
          }`
      )
      .join('\n');

    const msg =
      `*FIA CLEAN AND CARE*\n` +
      `Wholesale and Retail\n` +
      `Edathanattukara | Mob: 8086452106\n` +
      `-----------------------------\n` +
      `*CUSTOMER ACCOUNT STATEMENT*\n\n` +
      `*Customer:* ${customerData.name}\n` +
      `*Phone:* ${customerData.phone || '—'}\n\n` +
      `*Statement Summary:*\n` +
      `• Total Invoices: ${customerData.bills.length}\n` +
      `• Total Purchases: *₹${customerData.totalPurchases.toFixed(2)}*\n` +
      `• Total Amount Paid: *₹${customerData.totalPaid.toFixed(2)}*\n` +
      `• Balance Due: *₹${customerData.totalDue.toFixed(2)}*\n\n` +
      `*Detailed Invoices:*\n${billsList || 'No recorded bills.'}\n\n` +
      `_Thank you for your business!_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Sub Tabs Navigation */}
      <div className="flex bg-slate-200 p-1 rounded-lg max-w-md">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'directory'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 Customer Directory ({customers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('consolidation')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'consolidation'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📊 Accounts Consolidation
        </button>
      </div>

      {activeSubTab === 'directory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Customer Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>{editingCustomerId ? 'Edit Customer' : 'Add New Customer'}</span>
              </h3>
              {editingCustomerId && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                  EDIT MODE
                </span>
              )}
            </div>

            {formSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Customer / Store Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salim K. / Metro Supermarket"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-semibold focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9847123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-slate-200 p-2.5 rounded-md text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{editingCustomerId ? 'UPDATE CUSTOMER DETAILS' : 'SAVE TO DIRECTORY'}</span>
                </button>

                {editingCustomerId && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const cust = customers.find((c) => c.id === editingCustomerId);
                        if (cust) setCustomerToDelete(cust);
                      }}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomerId(null);
                        setName('');
                        setPhone('');
                      }}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded text-xs font-bold border border-slate-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Customer Directory List */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Registered Customers
                  </h3>
                  {customers.length > 0 && onClearAllCustomers && (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingClearAll(true)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200 transition flex items-center gap-1"
                      title="Clear all customer profiles"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {filteredCustomers.length} of {customers.length} customer profiles
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  No customers matching your search.
                </div>
              ) : (
                filteredCustomers.map((c) => {
                  const custSales = sales.filter(
                    (s) => (s.name || '').trim().toLowerCase() === c.name.trim().toLowerCase()
                  );
                  const custTotal = custSales.reduce((acc, s) => acc + (s.grandTotal || 0), 0);
                  const custDue = custSales.reduce((acc, s) => acc + (s.pendingAmount || 0), 0);

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-lg border transition space-y-3 ${
                        editingCustomerId === c.id
                          ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white hover:border-indigo-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                          <p className="text-xs font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 inline" />
                            <span>{c.phone || 'No phone recorded'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-slate-600 font-medium">
                          {custSales.length} {custSales.length === 1 ? 'Bill' : 'Bills'} • ₹{custTotal.toFixed(2)}
                        </span>
                        {custDue > 0 ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Due: {formatCurrency(custDue)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Cleared ✓
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: Clear, explicit and mobile friendly */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(c)}
                          className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CONSOLIDATION REPORT SUB-TAB */
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Customer Purchases & Balance Consolidation
              </h3>
              <p className="text-[11px] text-slate-400">
                Consolidated purchase totals, total paid, and pending dues across all invoices
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {consolidationList.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                No customer purchase activity found.
              </div>
            ) : (
              consolidationList.map((entry) => (
                <div
                  key={entry.name}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{entry.name}</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Phone: {entry.phone || '—'} • {entry.bills.length} Invoices Recorded
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700">
                          Total Purchases: {formatCurrency(entry.totalPurchases)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Paid: <span className="text-emerald-600 font-bold">{formatCurrency(entry.totalPaid)}</span> •{' '}
                          Due:{' '}
                          <span
                            className={`font-bold ${
                              entry.totalDue > 0 ? 'text-rose-600' : 'text-slate-500'
                            }`}
                          >
                            {formatCurrency(entry.totalDue)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => shareCustomerStatementWhatsApp(entry)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Bills Accordion / Preview */}
                  {entry.bills.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {entry.bills.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => onViewInvoice(b)}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 hover:border-indigo-400 transition cursor-pointer text-xs flex justify-between items-center"
                        >
                          <div>
                            <div className="font-mono font-bold text-slate-800">
                              #{b.billNo}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {formatDateDDMMYYYY(b.date)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-indigo-600">
                              {formatCurrency(b.grandTotal)}
                            </div>
                            {b.pendingAmount > 0 ? (
                              <span className="text-[10px] text-rose-600 font-bold">
                                Due {formatCurrency(b.pendingAmount)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium">Paid ✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* In-App Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Customer?</h4>
                <p className="text-xs text-slate-500">This will remove the customer profile.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">{customerToDelete.name}</div>
              <div className="text-slate-500 font-mono">Phone: {customerToDelete.phone || 'None'}</div>
            </div>

            <p className="text-[11px] text-slate-500">
              Note: Existing invoices associated with this customer will remain safe in invoice history.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold border border-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* In-App Clear All Customers Confirmation Modal */}
      {isConfirmingClearAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Clear All Customer Profiles?</h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove all {customers.length} customer profiles from the directory?
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded border border-amber-200">
              Note: Past sales and invoice records in history will remain intact. Only the directory and auto-suggest list will be cleared.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Clear All Profiles</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClearAll(false)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold border border-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
