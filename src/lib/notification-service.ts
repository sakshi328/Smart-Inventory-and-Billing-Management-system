
import { Product, Store, Invoice } from "./mock-data";
import { calculateSalesVelocity } from "./demand-utils";

export interface Alert {
    id: string;
    type: "warning" | "info" | "success" | "critical";
    title: string;
    message: string;
    date: string;
    read: boolean;
}

export const generateSystemAlerts = (products: Product[], invoices: Invoice[], storeId: string | null): Alert[] => {
    const alerts: Alert[] = [];
    const today = new Date().toISOString().split('T')[0];

    // 1. Low Stock Alerts
    products.forEach(p => {
        const stock = storeId ? (p.stores[storeId] || 0) : Object.values(p.stores).reduce((a, b) => a + b, 0);
        if (stock < p.lowStockThreshold) {
            alerts.push({
                id: `low-stock-${p.id}`,
                type: "critical",
                title: "Low Stock Warning",
                message: `Product ${p.name} is running low (${stock} remaining). Restock immediately.`,
                date: today,
                read: false
            });
        }
    });

    // 2. High Demand Alerts (Mock: using velocity)
    const highDemandProducts = products.filter(p => calculateSalesVelocity(p, storeId) > 4);
    if (highDemandProducts.length > 0) {
        alerts.push({
            id: `high-demand-${today}`,
            type: "info",
            title: "High Demand Detected",
            message: `${highDemandProducts.length} products are experiencing widely high sales velocity today.`,
            date: today,
            read: false
        });
    }

    // 3. Daily Sales Summary (Mock)
    const todaysSales = invoices.filter(i => i.date === today && (storeId ? i.storeId === storeId : true));
    const totalRevenue = todaysSales.reduce((acc, i) => acc + i.total, 0);

    if (totalRevenue > 0) {
        alerts.push({
            id: `daily-summary-${today}`,
            type: "success",
            title: "Daily Sales Summary",
            message: `Total revenue for today so far is $${totalRevenue.toFixed(2)} from ${todaysSales.length} invoices.`,
            date: today,
            read: false
        });
    }

    return alerts;
};
