
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Crown, User, Award } from "lucide-react";
import { invoices } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

// Mock Customer Interface (locally extended from what we might have)
interface CustomerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalSpend: number;
    points: number;
    tier: "Bronze" | "Silver" | "Gold";
    lastVisit: string;
}

// Generate Customer Profiles from Invoices
const getCustomers = (): CustomerProfile[] => {
    const customerMap: Record<string, CustomerProfile> = {};

    invoices.forEach(inv => {
        // Mock a consistent ID based on name for this demo
        const id = inv.customerName.toLowerCase().replace(/\s/g, '-');

        if (!customerMap[id]) {
            customerMap[id] = {
                id,
                name: inv.customerName,
                email: `${id}@example.com`,
                phone: "555-0123",
                totalSpend: 0,
                points: 0,
                tier: "Bronze",
                lastVisit: inv.date
            };
        }

        const customer = customerMap[id];
        customer.totalSpend += inv.total;

        // Update last visit if newer
        if (new Date(inv.date) > new Date(customer.lastVisit)) {
            customer.lastVisit = inv.date;
        }
    });

    // Calculate details
    return Object.values(customerMap).map(c => {
        const points = Math.floor(c.totalSpend / 10); // 1 point per $10
        let tier: "Bronze" | "Silver" | "Gold" = "Bronze";
        if (points > 500) tier = "Gold";
        else if (points > 200) tier = "Silver";

        return { ...c, points, tier };
    });
};

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const customers = getCustomers();

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const goldMembers = customers.filter(c => c.tier === "Gold").length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Customer Loyalty</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage customer profiles and loyalty rewards
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex items-center gap-4 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <Crown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Gold Members</p>
                            <p className="text-2xl font-bold text-yellow-600">{goldMembers}</p>
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Customers</p>
                            <p className="text-2xl font-bold">{customers.length}</p>
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Points Issued</p>
                            <p className="text-2xl font-bold text-green-600">
                                {customers.reduce((acc, c) => acc + c.points, 0).toLocaleString()}
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Current Tier</TableHead>
                                <TableHead className="text-right">Total Spend</TableHead>
                                <TableHead className="text-right">Loyalty Points</TableHead>
                                <TableHead className="text-right">Last Visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{customer.name}</p>
                                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                    ${customer.tier === 'Gold' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' :
                                                customer.tier === 'Silver' ? 'border-gray-400 text-gray-600 bg-gray-50' :
                                                    'border-orange-300 text-orange-600 bg-orange-50'}
                                `}>
                                            {customer.tier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${customer.totalSpend.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary">
                                        {customer.points}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {customer.lastVisit}
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

export default Customers;
