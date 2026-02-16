
import { Invoice, InvoiceItem } from "./mock-data";

export interface MonthlyTaxReport {
    month: string; // "Feb 2026"
    totalInvoices: number;
    taxableValue: number;
    totalGST: number;
    breakdown: Record<number, number>; // { 18: 500, 5: 100 } - Key is GST Rate, Value is Tax Amount
}

export const calculateItemTax = (price: number, qty: number, gstRate: number) => {
    const taxableValue = price * qty;
    const taxAmount = (taxableValue * gstRate) / 100;
    return {
        taxableValue,
        taxAmount,
        total: taxableValue + taxAmount
    };
};

export const generateMonthlyGSTReport = (invoices: Invoice[]): MonthlyTaxReport[] => {
    // Group invoices by Month-Year
    const reportMap: Record<string, MonthlyTaxReport> = {};

    invoices.forEach(inv => {
        // Parse date "2026-02-15" -> "Feb 2026"
        const date = new Date(inv.date);
        const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!reportMap[monthKey]) {
            reportMap[monthKey] = {
                month: monthKey,
                totalInvoices: 0,
                taxableValue: 0,
                totalGST: 0,
                breakdown: {}
            };
        }

        const report = reportMap[monthKey];
        report.totalInvoices++;
        report.taxableValue += inv.subtotal;
        report.totalGST += inv.tax;

        // Mock breakdown logic (Since we don't store per-item tax rate in invoice items yet properly, 
        // we'll infer it from product data or Mock it for the report)
        // Ideally InvoiceItem should have `gstRate` snapshot.
        // For this demo, we can simulate breakdown based on common rates (18%)
        const defaultRate = 18;
        if (!report.breakdown[defaultRate]) report.breakdown[defaultRate] = 0;
        report.breakdown[defaultRate] += inv.tax;
    });

    return Object.values(reportMap);
};
