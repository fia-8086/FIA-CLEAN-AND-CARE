import { Product, CosmeticProduct, CustomerProfile, Supplier, SaleRecord, PurchaseRecord, ExpenseRecord } from '../types';

export const initialCleaningProducts: Product[] = [
  {
    id: "prod_1788365324539",
    name: "DETERGENT LIQUID_COMFORT",
    stock: 10,
    unit: "Ltr",
    wholesalePrice: 45,
    retailPrice: 70
  },
  {
    id: "p_1787171586106",
    name: "DTL",
    stock: 100,
    unit: "Ltr",
    wholesalePrice: 40,
    retailPrice: 50
  }
];

export const initialCosmeticProducts: CosmeticProduct[] = [];

export const initialCustomers: CustomerProfile[] = [
  {
    id: "cust_1788366171303",
    name: "ISHAAL",
    phone: "9747731952",
    createdAt: "2026-09-02"
  },
  {
    id: "c_1787171550676",
    name: "PSB",
    phone: "123",
    createdAt: "2026-08-19"
  },
  {
    id: "cust_1788365390780",
    name: "SHIDU",
    phone: "1323231",
    createdAt: "2026-09-02"
  }
];

export const initialSuppliers: Supplier[] = [];

export const initialSales: SaleRecord[] = [
  {
    id: "sale_1788370000000",
    billNo: "CLN-0004",
    type: "cleaning",
    name: "ISHAAL",
    phone: "9747731952",
    saleType: "Retail",
    paymentMode: "Cash",
    items: [
      {
        id: "item_cln4_1",
        productName: "DETERGENT LIQUID_COMFORT",
        stockId: "prod_1788365324539",
        packageSizeMl: 5000,
        packUnit: "Ltr",
        packDisplay: "5 Liter",
        qty: 1,
        unitType: "5 Liter Bottle",
        rate: 350,
        baseRate: 70,
        total: 350,
        stockDeductionQty: 5
      }
    ],
    grandTotal: 350,
    paidAmount: 350,
    pendingAmount: 0,
    excessAmount: 0,
    date: "2026-09-02",
    createdAt: 1788370000000
  },
  {
    id: "sale_1788367472943",
    billNo: "CLN-0003",
    type: "cleaning",
    name: "ISHAAL",
    phone: "9747731952",
    saleType: "Retail",
    paymentMode: "Cash",
    items: [
      {
        id: "item_1788367447983_0hg8",
        productName: "DETERGENT LIQUID_COMFORT",
        stockId: "prod_1788365324539",
        packageSizeMl: 30000,
        packUnit: "Ltr",
        packDisplay: "30 Liter",
        qty: 1,
        unitType: "30 Liter Bottle",
        rate: 2100,
        baseRate: 70,
        total: 2100,
        stockDeductionQty: 30
      }
    ],
    grandTotal: 2100,
    paidAmount: 2100,
    pendingAmount: 0,
    excessAmount: 0,
    date: "2026-09-02",
    createdAt: 1788367472943
  },
  {
    id: "sale_1788366223332",
    billNo: "CLN-0002",
    type: "cleaning",
    name: "ISHAAL",
    phone: "9747731952",
    saleType: "Retail",
    paymentMode: "Cash",
    items: [
      {
        id: "item_1788366216765_pnx0",
        productName: "DETERGENT LIQUID_COMFORT",
        stockId: "prod_1788365324539",
        packageSizeMl: 5000,
        packUnit: "Ltr",
        packDisplay: "5 Liter",
        qty: 1,
        unitType: "5 Liter Bottle",
        rate: 350,
        baseRate: 70,
        total: 350,
        stockDeductionQty: 5
      }
    ],
    grandTotal: 350,
    paidAmount: 350,
    pendingAmount: 0,
    excessAmount: 0,
    date: "2026-09-02",
    createdAt: 1788366223332
  }
];

export const initialPurchases: PurchaseRecord[] = [];
export const initialExpenses: ExpenseRecord[] = [];

