
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { products as mockProducts } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import { generateDemandReport, DemandPrediction } from "@/lib/demand-utils";
import { AlertTriangle, TrendingUp, Package, Truck } from "lucide-react";

const DemandForecast = () => {
    const { currentStore } = useStore();
    const [filter, setFilter] = useState("all"); // all, critical, high-demand

    const report = generateDemandReport(mockProducts, currentStore?.id || null);

    const filteredReport = report.filter(item => {
        if (filter === "critical") return item.daysToEmpty < 7;
        if (filter === "high-demand") return item.status === "High";
        return true;
    });

    const criticalItems = report.filter(i => i.daysToEmpty < 7).length;
    const highDemandItems = report.filter(i => i.status === "High").length;
    const restockNeeded = report.reduce((acc, item) => acc + item.restockSuggestion, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Smart Demand Forecast</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        AI-Powered Inventory Predictions for {currentStore ? currentStore.name : "All Stores"}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex items-center gap-4 bg-red-50 dark:bg-red-900/10 border-red-200">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Critical Stock</p>
                            <p className="text-2xl font-bold text-red-600">{criticalItems} Items</p>
                            <p className="text-xs text-muted-foreground">Run out in &lt; 7 days</p>
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">High Demand</p>
                            <p className="text-2xl font-bold text-blue-600">{highDemandItems} Items</p>
                            <p className="text-xs text-muted-foreground">Fast moving products</p>
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center gap-4 bg-green-50 dark:bg-green-900/10 border-green-200">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Restock Needed</p>
                            <p className="text-2xl font-bold text-green-600">{restockNeeded} Units</p>
                            <p className="text-xs text-muted-foreground">To cover 30 days</p>
                        </div>
                    </Card>
                </div>

                {/* Main Table */}
                <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Prediction Details</h3>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter View" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Items</SelectItem>
                                <SelectItem value="critical">Critical Stock Only</SelectItem>
                                <SelectItem value="high-demand">High Demand Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">Daily Sales</TableHead>
                                <TableHead className="text-right">Days Left</TableHead>
                                <TableHead className="text-center">Demand Status</TableHead>
                                <TableHead className="text-right">Suggested Restock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReport.map((item, i) => (
                                <TableRow key={item.productId}>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell className="text-right">{item.currentStock}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{item.salesVelocity} / day</TableCell>
                                    <TableCell className={`text-right font-bold ${item.daysToEmpty < 7 ? "text-red-500" : "text-green-600"}`}>
                                        {item.daysToEmpty > 365 ? "> 1 Year" : `${item.daysToEmpty} Days`}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${item.status === "High" ? "bg-blue-100 text-blue-700" :
                                                item.status === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {item.restockSuggestion > 0 ? `+${item.restockSuggestion}` : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DemandForecast;
