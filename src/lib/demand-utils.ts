
import { Product, Store, topSellingProducts, invoices } from "./mock-data";

export interface DemandPrediction {
    productId: string;
    productName: string;
    currentStock: number;
    salesVelocity: number; // units per day (avg over last 7 days)
    daysToEmpty: number;
    status: "High" | "Medium" | "Low";
    restockSuggestion: number;
}

// Helper: Calculate Sales Velocity (Mock Logic: using random + historical data)
// In a real app, this would query sales from the last 7 days for the specific store
export const calculateSalesVelocity = (product: Product, storeId: string | null): number => {
    // Mock logic: Base velocity on product popularity + randomness
    const isTopSeller = topSellingProducts.some(p => p.name === product.name);
    let baseVelocity = isTopSeller ? 5 : 1;

    // Adjust for store (assuming Main store has more traffic)
    if (storeId === "NORTH") baseVelocity *= 0.5;

    // Add some random fluctuation
    return Number((baseVelocity + Math.random() * 2).toFixed(2));
};

export const predictStockOut = (currentStock: number, velocity: number): number => {
    if (velocity <= 0) return 999; // No sales, infinite stock
    const days = currentStock / velocity;
    return Number(days.toFixed(1));
};

export const getDemandStatus = (velocity: number): "High" | "Medium" | "Low" => {
    if (velocity > 4) return "High";
    if (velocity > 1.5) return "Medium";
    return "Low";
};

export const getRestockSuggestion = (currentStock: number, velocity: number): number => {
    const targetDays = 30; // We want stock for 30 days
    const needed = velocity * targetDays;
    const toOrder = needed - currentStock;
    return toOrder > 0 ? Math.ceil(toOrder) : 0;
};

export const generateDemandReport = (products: Product[], storeId: string | null): DemandPrediction[] => {
    return products.map(product => {
        const stock = storeId ? (product.stores[storeId] || 0) : Object.values(product.stores).reduce((a, b) => a + b, 0);
        const velocity = calculateSalesVelocity(product, storeId);

        return {
            productId: product.id,
            productName: product.name,
            currentStock: stock,
            salesVelocity: velocity,
            daysToEmpty: predictStockOut(stock, velocity),
            status: getDemandStatus(velocity),
            restockSuggestion: getRestockSuggestion(stock, velocity)
        };
    });
};
