
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Search, RotateCcw, CheckCircle } from "lucide-react";
import { invoices, Invoice, InvoiceItem } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

const Returns = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Local state to simulate database updates for this session
    const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [returnReason, setReturnReason] = useState("");

    const handleSearch = () => {
        const found = localInvoices.find(i => i.invoiceNumber === searchTerm);
        if (found) {
            setSelectedInvoice(found);
        } else {
            toast({ variant: "destructive", title: "Not Found", description: "Invoice number not found." });
            setSelectedInvoice(null);
        }
    };

    const processRefund = () => {
        if (!selectedInvoice) return;

        // Mock Update Status
        const updatedInvoices = localInvoices.map(inv =>
            inv.id === selectedInvoice.id ? { ...inv, status: "refunded" as const } : inv
        );

        setLocalInvoices(updatedInvoices);
        setSelectedInvoice({ ...selectedInvoice, status: "refunded" });

        toast({
            title: "Refund Processed",
            description: `Invoice ${selectedInvoice.invoiceNumber} marked as refunded. Stock updated.`
        });

        // Reset form
        setReturnReason("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Returns & Refunds</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Process product returns and manage refunds
                    </p>
                </div>

                <div className="flex items-center space-x-4 max-w-lg">
                    <Input
                        placeholder="Enter Invoice # (e.g. INV-001)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        Find Invoice
                    </Button>
                </div>

                {selectedInvoice && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-muted/50 p-6 rounded-lg border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">Invoice #{selectedInvoice.invoiceNumber}</h3>
                                    <p className="text-sm text-muted-foreground">Customer: {selectedInvoice.customerName}</p>
                                    <p className="text-sm text-muted-foreground">Date: {selectedInvoice.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl">${selectedInvoice.total.toFixed(2)}</p>
                                    <p className={`text-sm font-semibold uppercase ${selectedInvoice.status === 'paid' ? 'text-green-600' :
                                            selectedInvoice.status === 'refunded' ? 'text-orange-600' : 'text-red-600'
                                        }`}>Status: {selectedInvoice.status}</p>
                                </div>
                            </div>

                            <Table className="mt-4 bg-background rounded-md border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedInvoice.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">${item.unitPrice}</TableCell>
                                            <TableCell className="text-right">${item.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 flex justify-end">
                                {selectedInvoice.status !== "refunded" ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive">
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                Initiate Refund
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Confirm Refund</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <p className="text-sm text-muted-foreground">
                                                    This action will mark the invoice as refunded and update stock levels.
                                                </p>
                                                <Input
                                                    placeholder="Reason for return (optional)"
                                                    value={returnReason}
                                                    onChange={e => setReturnReason(e.target.value)}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={processRefund} variant="destructive">Confirm Refund</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button variant="outline" disabled className="text-orange-600 border-orange-200 bg-orange-50">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Refunded Successfully
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Returns;
