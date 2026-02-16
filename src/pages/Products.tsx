import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Edit, Trash2, Store as StoreIcon } from "lucide-react";
import { products, categories, getTotalStock } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";

const Products = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { currentStore, setCurrentStore, stores } = useStore();

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockForProduct = (product: typeof products[0]) => {
    if (currentStore) {
      return product.stores[currentStore.id] || 0;
    }
    return getTotalStock(product);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your inventory across stores
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={currentStore?.id || "all"}
              onValueChange={(val) => setCurrentStore(val === "all" ? null : stores.find(s => s.id === val) || null)}
            >
              <SelectTrigger className="w-[180px]">
                <StoreIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">SKU</TableHead>
                <TableHead className="text-xs">Product</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs text-right">Cost</TableHead>
                <TableHead className="text-xs text-right">Price</TableHead>
                <TableHead className="text-xs text-right">GST %</TableHead>
                <TableHead className="text-xs text-right">Stock {currentStore ? `(${currentStore.name})` : "(Total)"}</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product, i) => {
                const stock = getStockForProduct(product);
                return (
                  <TableRow key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-sm text-right">
                      ${product.costPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">
                      ${product.sellingPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-right text-muted-foreground">
                      {product.gstRate}%
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">
                      {stock}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          stock <= product.lowStockThreshold ? "low" : "ok"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Products;
