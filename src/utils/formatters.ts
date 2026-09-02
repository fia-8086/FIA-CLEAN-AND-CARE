import { SaleRecord } from '../types';

export function formatCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return '₹ ' + safeAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(val: number): string {
  const safe = Number.isFinite(val) ? val : 0;
  return safe.toLocaleString('en-IN');
}

export function formatDateDDMMYYYY(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const s = String(dateStr).trim();
  const m1 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
  const m2 = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return s;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateNextBillNo(prefix: string, existingBills: SaleRecord[]): string {
  const matching = existingBills
    .filter((b) => b.billNo && b.billNo.startsWith(prefix))
    .map((b) => {
      const match = b.billNo.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
  const max = matching.length > 0 ? Math.max(...matching) : 0;
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.map((h) => `"${h}"`).join(',') + '\n';
  rows.forEach((row) => {
    csvContent +=
      row
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',') + '\n';
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportJSONBackup(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatPackDisplay(item: {
  packageSizeMl?: number;
  packDisplay?: string;
  packUnit?: string;
  unitType?: string;
}): string {
  if (item.packDisplay) return item.packDisplay;
  if (item.packageSizeMl !== undefined && item.packageSizeMl > 0) {
    const ml = item.packageSizeMl;
    if (item.packUnit === 'Kg' || item.packUnit === 'g' || item.packUnit === 'mg') {
      if (item.packUnit === 'mg') return `${ml} mg`;
      if (ml >= 1000 && ml % 1000 === 0) return `${ml / 1000} Kg`;
      if (ml >= 1000) return `${(ml / 1000).toFixed(2).replace(/\.?0+$/, '')} Kg`;
      return `${ml} g`;
    }
    // Liquid
    if (ml >= 1000 && ml % 1000 === 0) return `${ml / 1000} Ltr`;
    if (ml >= 1000) return `${(ml / 1000).toFixed(2).replace(/\.?0+$/, '')} Ltr`;
    return `${ml} ml`;
  }
  return item.unitType || '—';
}

export function createWhatsAppBillMessage(sale: SaleRecord): string {
  const itemsText = sale.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* - ${item.qty} ${formatPackDisplay(item)} x ₹${Number(
          item.rate
        ).toFixed(2)} = ₹${Number(item.total).toFixed(2)}`
    )
    .join('\n');

  const pendingText =
    sale.pendingAmount > 0
      ? `*Balance Due:* ₹${sale.pendingAmount.toFixed(2)}\n`
      : '';
  const excessText =
    (sale.excessAmount || 0) > 0
      ? `*Excess / Return:* ₹${(sale.excessAmount || 0).toFixed(2)}\n`
      : '';

  return (
    `*FIA CLEAN AND CARE*\n` +
    `*Wholesale and Retail*\n` +
    `*Edathanattukara*\n` +
    `*Mob:8086452106*\n` +
    `*CASH BILL*\n\n` +
    `*Bill No:* #${sale.billNo}\n` +
    `*Customer:* ${sale.name}\n` +
    `*Date:* ${formatDateDDMMYYYY(sale.date)}\n` +
    `*Type:* ${sale.saleType} | *Payment:* ${sale.paymentMode}\n\n` +
    `*Items:*\n${itemsText}\n\n` +
    `*Grand Total:* *₹${sale.grandTotal.toFixed(2)}*\n` +
    `*Paid Amount:* ₹${sale.paidAmount.toFixed(2)}\n` +
    `${pendingText}${excessText}\n` +
    `_Thank you for choosing FIA Clean & Care!_`
  );
}
