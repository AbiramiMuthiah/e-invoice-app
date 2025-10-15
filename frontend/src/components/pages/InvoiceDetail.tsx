import { useParams, useNavigate } from "react-router-dom";
import { useAI } from "../../context/AIContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ArrowLeft, Download, Edit, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { generatePDF } from "../../utils/pdfGenerator"; // Ensure this path is correct

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices } = useAI();

  const invoice = invoices.find(inv => inv.id === id);

  // --- Action Handler for Downloading PDF ---
  const handleDownloadPDF = () => {
    if (!invoice) return;
    try {
      generatePDF(invoice);
      toast.success("PDF Downloaded", { description: `Invoice ${invoice.invoiceNumber} has been saved.` });
    } catch (error) {
      toast.error("Export Failed", { description: "Could not generate the PDF file." });
      console.error("PDF Generation Error:", error);
    }
  };

  // --- Graceful Handling if Invoice is Not Found ---
  if (!invoice) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#1e293b]">Invoice Not Found</h1>
        <p className="text-[#64748b]">The invoice data may have been lost on page refresh. Please go back and try again.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500 hover:bg-emerald-500';
      case 'sent': return 'bg-blue-600 hover:bg-blue-600';
      case 'generated': return 'bg-violet-600 hover:bg-violet-600';
      default: return 'bg-slate-500 hover:bg-slate-500';
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-full">
      {/* Header with Actions */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/")} aria-label="Back to Dashboard">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Invoice {invoice.invoiceNumber}</h1>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info("Edit functionality coming soon!")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
            </Button>
            <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
            </Button>
        </div>
      </div>

      {/* Main Invoice Card */}
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-600">INVOICE</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Issued: {invoice.date} | Due: {invoice.dueDate}
                    </p>
                </div>
                <Badge className={`text-sm ${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Vendor and Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-slate-500 mb-2 uppercase tracking-wider">From</h3>
              <p className="font-bold text-[#1e293b]">{invoice.vendor}</p>
              <p className="text-slate-500">{invoice.vendorAddress}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-500 mb-2 uppercase tracking-wider">For</h3>
              <p className="font-bold text-[#1e293b]">{invoice.client}</p>
              <p className="text-slate-500">{invoice.clientAddress}</p>
            </div>
          </div>
          
          {/* Items Table */}
          <div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 hover:bg-slate-100">
                  <TableHead className="font-semibold text-[#1e293b]">Description</TableHead>
                  <TableHead className="text-right font-semibold text-[#1e293b]">Qty</TableHead>
                  <TableHead className="text-right font-semibold text-[#1e293b]">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold text-[#1e293b]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Safety check for items array */}
                {invoice.items && invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (10%)</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-[#1e293b]">Total</span>
                <span className="text-blue-600">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}