
import { Invoice } from "./mock-data";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateInvoicePDF = async (invoiceId: string, elementId: string) => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error("Invoice element not found");
        return;
    }

    try {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`Invoice_${invoiceId}.pdf`);
        return true;
    } catch (error) {
        console.error("Error generating PDF", error);
        return false;
    }
};

export const sendInvoiceEmail = async (invoice: Invoice, email: string): Promise<boolean> => {
    return new Promise((resolve) => {
        // Simulate sending email
        setTimeout(() => {
            resolve(true);
        }, 1500);
    });
};
