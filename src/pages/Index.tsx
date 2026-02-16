import DashboardLayout from "@/components/DashboardLayout";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
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
  DollarSign,
  Package,
  FileText,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  revenueData,
  topSellingProducts,
  getLowStockProducts,
  getTotalRevenue,
  getTotalProfit,
  getTotalProducts,
  getPendingInvoices,
  invoices,
} from "@/lib/mock-data";

const Dashboard = () => {
  const lowStock = getLowStockProducts();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your inventory and sales performance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Revenue"
            value={`$${getTotalRevenue().toLocaleString()}`}
            change="+12.5% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <KpiCard
            title="Total Profit"
            value={`$${getTotalProfit().toLocaleString()}`}
            change="+8.2% from last month"
            changeType="positive"
            icon={TrendingUp}
          />
          <KpiCard
            title="Products"
            value={getTotalProducts().toString()}
            change={`${lowStock.length} low stock`}
            changeType="negative"
            icon={Package}
          />
          <KpiCard
            title="Pending Invoices"
            value={getPendingInvoices().toString()}
            change="Requires attention"
            changeType="neutral"
            icon={FileText}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="col-span-2 p-6">
            <h3 className="text-sm font-semibold mb-4">Revenue & Profit</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(221, 83%, 53%)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(160, 84%, 39%)"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topSellingProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={100}
                  stroke="hsl(220, 9%, 46%)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sold" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Recent Invoices</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.slice(0, 4).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm font-medium font-mono">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-sm">{inv.customerName}</TableCell>
                    <TableCell className="text-sm">${inv.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Low Stock Alerts</h3>
            </div>
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku} · Threshold: {product.lowStockThreshold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-destructive">{product.stock}</p>
                    <p className="text-xs text-muted-foreground">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
