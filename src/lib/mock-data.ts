
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interfaces
export interface Store {
  id: string;
  name: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  // stock is now per store. key is storeId, value is quantity
  stores: Record<string, number>;
  lowStockThreshold: number;
  sku: string;
  gstRate: number; // New: GST Percentage
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "refunded"; // Added refunded
  storeId: string; // New: Link to Store
  paymentMethod: "Cash" | "UPI" | "Card" | "Credit"; // New: Payment Mode
  taxDetails?: { rate: number; amount: number }[]; // New: Breakdown
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  totalSpent: number;
  joinDate: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  profit: number;
}

export const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Office Supplies",
  "Hardware",
];

// Mock Stores
export const stores: Store[] = [
  { id: "MAIN", name: "Main Branch", location: "Downtown" },
  { id: "NORTH", name: "North Wing", location: "Uptown" },
];

// Mock Customers
export const customers: Customer[] = [
  { id: "C1", name: "Acme Corp", email: "contact@acme.com", phone: "555-0101", points: 150, totalSpent: 5000, joinDate: "2025-01-10" },
  { id: "C2", name: "John Doe", email: "john@example.com", phone: "555-0102", points: 45, totalSpent: 120, joinDate: "2025-02-14" },
];

export const products: Product[] = [
  { id: "1", name: "Wireless Mouse", category: "Electronics", costPrice: 12, sellingPrice: 25, stores: { "MAIN": 150, "NORTH": 50 }, lowStockThreshold: 20, sku: "EL-001", gstRate: 18 },
  { id: "2", name: "USB-C Hub", category: "Electronics", costPrice: 18, sellingPrice: 45, stores: { "MAIN": 8, "NORTH": 0 }, lowStockThreshold: 15, sku: "EL-002", gstRate: 18 },
  { id: "3", name: "Mechanical Keyboard", category: "Electronics", costPrice: 35, sellingPrice: 89, stores: { "MAIN": 42, "NORTH": 12 }, lowStockThreshold: 10, sku: "EL-003", gstRate: 18 },
  { id: "4", name: "Cotton T-Shirt (L)", category: "Clothing", costPrice: 5, sellingPrice: 19.99, stores: { "MAIN": 200, "NORTH": 100 }, lowStockThreshold: 30, sku: "CL-001", gstRate: 5 },
  { id: "5", name: "Denim Jeans", category: "Clothing", costPrice: 15, sellingPrice: 49.99, stores: { "MAIN": 3, "NORTH": 5 }, lowStockThreshold: 10, sku: "CL-002", gstRate: 12 },
  { id: "6", name: "Green Tea (Box)", category: "Food & Beverages", costPrice: 3, sellingPrice: 8.50, stores: { "MAIN": 500, "NORTH": 0 }, lowStockThreshold: 50, sku: "FB-001", gstRate: 5 },
  { id: "7", name: "Protein Bars (12pk)", category: "Food & Beverages", costPrice: 8, sellingPrice: 18, stores: { "MAIN": 75, "NORTH": 25 }, lowStockThreshold: 20, sku: "FB-002", gstRate: 12 },
  { id: "8", name: "A4 Paper Ream", category: "Office Supplies", costPrice: 2.50, sellingPrice: 6.99, stores: { "MAIN": 12, "NORTH": 40 }, lowStockThreshold: 25, sku: "OS-001", gstRate: 12 },
  { id: "9", name: "Ballpoint Pens (10pk)", category: "Office Supplies", costPrice: 1.20, sellingPrice: 4.50, stores: { "MAIN": 300, "NORTH": 150 }, lowStockThreshold: 40, sku: "OS-002", gstRate: 12 },
  { id: "10", name: "Power Drill", category: "Hardware", costPrice: 40, sellingPrice: 95, stores: { "MAIN": 18, "NORTH": 2 }, lowStockThreshold: 5, sku: "HW-001", gstRate: 18 },
];

export const invoices: Invoice[] = [
  {
    id: "1", invoiceNumber: "INV-001", customerName: "Acme Corp", date: "2026-02-15",
    items: [
      { productId: "1", productName: "Wireless Mouse", quantity: 10, unitPrice: 25, total: 250 },
      { productId: "3", productName: "Mechanical Keyboard", quantity: 5, unitPrice: 89, total: 445 },
    ],
    subtotal: 695, tax: 62.55, total: 757.55, status: "paid", storeId: "MAIN", paymentMethod: "Credit",
  },
  {
    id: "2", invoiceNumber: "INV-002", customerName: "TechStart Inc", date: "2026-02-14",
    items: [
      { productId: "2", productName: "USB-C Hub", quantity: 20, unitPrice: 45, total: 900 },
    ],
    subtotal: 900, tax: 81, total: 981, status: "pending", storeId: "MAIN", paymentMethod: "UPI",
  },
  {
    id: "3", invoiceNumber: "INV-003", customerName: "Daily Grind Cafe", date: "2026-02-10",
    items: [
      { productId: "6", productName: "Green Tea (Box)", quantity: 50, unitPrice: 8.50, total: 425 },
      { productId: "7", productName: "Protein Bars (12pk)", quantity: 30, unitPrice: 18, total: 540 },
    ],
    subtotal: 965, tax: 86.85, total: 1051.85, status: "paid", storeId: "NORTH", paymentMethod: "Cash",
  },
  {
    id: "4", invoiceNumber: "INV-004", customerName: "BuildRight LLC", date: "2026-02-08",
    items: [
      { productId: "10", productName: "Power Drill", quantity: 3, unitPrice: 95, total: 285 },
    ],
    subtotal: 285, tax: 25.65, total: 310.65, status: "overdue", storeId: "MAIN", paymentMethod: "Card",
  },
];

export const revenueData: RevenueData[] = [
  { date: "Feb 1", revenue: 1200, profit: 480 },
  { date: "Feb 2", revenue: 980, profit: 390 },
  { date: "Feb 3", revenue: 1450, profit: 620 },
  { date: "Feb 4", revenue: 870, profit: 340 },
  { date: "Feb 5", revenue: 2100, profit: 890 },
  { date: "Feb 6", revenue: 1680, profit: 710 },
  { date: "Feb 7", revenue: 1320, profit: 560 },
  { date: "Feb 8", revenue: 1890, profit: 780 },
  { date: "Feb 9", revenue: 2400, profit: 1020 },
  { date: "Feb 10", revenue: 1750, profit: 740 },
  { date: "Feb 11", revenue: 1100, profit: 450 },
  { date: "Feb 12", revenue: 2050, profit: 870 },
  { date: "Feb 13", revenue: 1600, profit: 680 },
  { date: "Feb 14", revenue: 2800, profit: 1190 },
  { date: "Feb 15", revenue: 3100, profit: 1320 },
];

export const topSellingProducts = [
  { name: "Wireless Mouse", sold: 342, revenue: 8550 },
  { name: "Green Tea (Box)", sold: 280, revenue: 2380 },
  { name: "Cotton T-Shirt (L)", sold: 215, revenue: 4297 },
  { name: "Mechanical Keyboard", sold: 156, revenue: 13884 },
  { name: "Ballpoint Pens (10pk)", sold: 140, revenue: 630 },
];

// Helper to get total stock across all stores
export const getTotalStock = (product: Product) => {
  return Object.values(product.stores).reduce((a, b) => a + b, 0);
}

// Helper: Get Low Stock Products (Global)
export const getLowStockProducts = () =>
  products.filter((p) => getTotalStock(p) <= p.lowStockThreshold);

export const getTotalRevenue = () =>
  revenueData.reduce((sum, d) => sum + d.revenue, 0);

export const getTotalProfit = () =>
  revenueData.reduce((sum, d) => sum + d.profit, 0);

export const getTotalProducts = () => products.length;

export const getPendingInvoices = () =>
  invoices.filter((i) => i.status === "pending" || i.status === "overdue").length;
