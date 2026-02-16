
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
import { invoices } from "@/lib/mock-data";
import { generateMonthlyGSTReport } from "@/lib/tax-utils";
import { FileBarChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const GSTReport = () => {
    const reports = generateMonthlyGSTReport(invoices);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">GST Reports</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Monthly Tax Return Summary
                        </p>
                    </div>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download GSTR-1 JSON
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Summary Card */}
                    <Card className="p-6 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <FileBarChart className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total GST Collected (This Year)</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    ${reports.reduce((acc, r) => acc + r.totalGST, 0).toFixed(2)}
                                </h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Report Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead className="text-right">Invoices</TableHead>
                                <TableHead className="text-right">Taxable Value</TableHead>
                                <TableHead className="text-right">Total GST Output</TableHead>
                                <TableHead className="text-right">Breakdown (18%)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.month}>
                                    <TableCell className="font-medium">{report.month}</TableCell>
                                    <TableCell className="text-right">{report.totalInvoices}</TableCell>
                                    <TableCell className="text-right">${report.taxableValue.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-bold">${report.totalGST.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        ${report.breakdown[18]?.toFixed(2) || "0.00"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View Details</Button>
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

export default GSTReport;
