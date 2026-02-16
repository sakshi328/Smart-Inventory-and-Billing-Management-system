
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
} from "@/components/ui/dialog";
import { Plus, Search, FileDown, Printer, Mail } from "lucide-react";
import { invoices, Invoice } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { generateInvoicePDF, sendInvoiceEmail } from "@/lib/invoice-utils";
import { useToast } from "@/components/ui/use-toast";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentStore } = useStore();
  const { toast } = useToast();

  // State for Print/PDF
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (currentStore ? invoice.storeId === currentStore.id : true) &&
      (invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Timeout to allow state update and DOM render of the template
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(async () => {
      const success = await generateInvoicePDF(invoice.id, "invoice-template-container");
      if (success) {
        toast({ title: "PDF Downloaded", description: `Invoice ${invoice.invoiceNumber} saved.` });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF." });
      }
    }, 100);
  };

  const handleEmail = async (invoice: Invoice) => {
    toast({ title: "Sending Email...", description: "Please wait." });
    await sendInvoiceEmail(invoice, "customer@example.com");
    toast({ title: "Email Sent", description: `Invoice ${invoice.invoiceNumber} has been emailed.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hidden Template for Printing/PDF */}
        <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
          {selectedInvoice && <InvoiceTemplate invoice={selectedInvoice} id="invoice-template-container" />}
        </div>
        {/* Also render it hidden in screen view for html2canvas to grab */}
        <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none">
          {selectedInvoice && <InvoiceTemplate invoice={selectedInvoice} id="invoice-template-container" />}
        </div>


        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage billing and payments for {currentStore ? currentStore.name : "All Stores"}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">Invoice creation form will go here.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default" // "success" variant doesn't exist in default shadcn badge, using default which is black/primary
                          : invoice.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={invoice.status === "paid" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.paymentMethod || "Cash"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice)} title="Print">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(invoice)} title="Download PDF">
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEmail(invoice)} title="Email">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
