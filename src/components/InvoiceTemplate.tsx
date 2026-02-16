
import { Invoice } from "@/lib/mock-data";
import { format } from "date-fns";

interface InvoiceTemplateProps {
    invoice: Invoice | null;
    id: string; // DOM ID for PDF generation
}

const InvoiceTemplate = ({ invoice, id }: InvoiceTemplateProps) => {
    if (!invoice) return null;

    return (
        <div id={id} className="p-8 bg-white text-black w-[210mm] mx-auto hidden print:block bg-white dark:bg-white text-black dark:text-black">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                    <p className="text-gray-500 mt-1">#{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">InvenTrack Inc.</h2>
                    <p className="text-sm text-gray-600">123, Tech Park</p>
                    <p className="text-sm text-gray-600">Mumbai, MH 400001</p>
                    <p className="text-sm text-gray-600">GSTIN: 27ABCDE1234F1Z5</p>
                </div>
            </div>

            {/* Bill To & Details */}
            <div className="flex justify-between mb-8 border-b pb-8">
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase">Bill To</p>
                    <p className="font-bold text-lg">{invoice.customerName}</p>
                    <p className="text-sm text-gray-600">Client Address Line 1</p>
                    <p className="text-sm text-gray-600">City, Pincode</p>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase mr-4">Date:</span>
                        <span>{format(new Date(invoice.date), "dd MMM yyyy")}</span>
                    </div>
                    <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase mr-4">Status:</span>
                        <span className="uppercase font-bold">{invoice.status}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-500 uppercase mr-4">Payment:</span>
                        <span className="font-bold">{invoice.paymentMethod || "N/A"}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-800">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-2">{item.productName}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                            <td className="text-right py-2">${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-800 pt-2 mt-2">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p>This is a computer generated invoice.</p>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
