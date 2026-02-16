
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { invoices, products, Store } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import {
  getSalesByDayOfWeek,
  getHourlyTraffic,
  getPaymentStats
} from "@/lib/analytics-utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const { currentStore } = useStore();

  const filteredInvoices = currentStore
    ? invoices.filter(i => i.storeId === currentStore.id)
    : invoices;

  // 1. Weekly Sales Trend
  const weeklySales = getSalesByDayOfWeek(filteredInvoices);

  // 2. Hourly Traffic (Peak Hours)
  const hourlyTraffic = getHourlyTraffic(filteredInvoices);

  // 3. Payment Methods
  const paymentStats = getPaymentStats(filteredInvoices);

  // 4. Category Performance (Existing logic adapted)
  // Calculate total stock value by category
  const categoryData = products.reduce((acc: any[], product) => {
    const stock = currentStore
      ? (product.stores[currentStore.id] || 0)
      : Object.values(product.stores).reduce((a, b) => a + b, 0);

    const existingCategory = acc.find((item) => item.name === product.category);
    const value = stock * product.sellingPrice;

    if (existingCategory) {
      existingCategory.value += value;
    } else {
      acc.push({ name: product.category, value });
    }
    return acc;
  }, []);


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Performance metrics for {currentStore ? currentStore.name : "All Stores"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Weekly Trend - Bar Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklySales}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="sales" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods - Pie Chart */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={paymentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Hourly Traffic - Line Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Peak Hours (Traffic)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyTraffic}>
                  <XAxis dataKey="hour" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="invoices" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance - Pie Chart */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Stock Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
