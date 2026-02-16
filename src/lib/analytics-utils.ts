
import { Invoice } from "./mock-data";

export interface SalesByDay {
    day: string;
    sales: number;
}

export interface SalesByHour {
    hour: string; // "10 AM", "11 AM"
    invoices: number;
}

export interface CategoryPerformance {
    category: string;
    sales: number;
}

export const getSalesByDayOfWeek = (invoices: Invoice[]): SalesByDay[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const salesMap = new Array(7).fill(0);

    invoices.forEach(inv => {
        const date = new Date(inv.date);
        const dayIndex = date.getDay();
        salesMap[dayIndex] += inv.total;
    });

    return days.map((day, index) => ({
        day,
        sales: salesMap[index]
    }));
};

// Mock hourly distribution since mock date string doesn't include time usually
// We will deterministically generate "hours" based on invoice hash or index for demo
export const getHourlyTraffic = (invoices: Invoice[]): SalesByHour[] => {
    const hoursMap: Record<number, number> = {};

    // Initialize 9 AM to 9 PM
    for (let i = 9; i <= 21; i++) hoursMap[i] = 0;

    invoices.forEach((inv, index) => {
        // Mock hour: 9 + (index % 12)
        const hour = 9 + (index % 13);
        if (hoursMap[hour] !== undefined) {
            hoursMap[hour]++;
        }
    });

    return Object.entries(hoursMap).map(([hour, count]) => ({
        hour: `${hour}:00`,
        invoices: count
    }));
};

export const getPaymentStats = (invoices: Invoice[]) => {
    const stats: Record<string, number> = {};
    invoices.forEach(inv => {
        const method = inv.paymentMethod || "Cash";
        stats[method] = (stats[method] || 0) + inv.total;
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
};
