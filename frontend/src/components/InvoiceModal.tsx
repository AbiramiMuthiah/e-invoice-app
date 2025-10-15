import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Download, Send, Edit, Trash2, FileText } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { toast } from 'sonner';
import { InvoiceModalEdit } from './InvoiceModalEdit';
import { generatePDF } from '../utils/pdfGenerator'; // Ensure this path is correct

// Interface definitions should be here
interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
  
interface Invoice {
    id: string;
    invoiceNumber: string;
    vendor: string;
    vendorAddress: string;
    vendorTaxId: string;
    client: string;
    clientAddress: string;
    clientEmail: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'draft' | 'generated' | 'sent' | 'paid';
    createdAt: string;
}

interface InvoiceModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

// CORRECTED STRUCTURE: The export is at the top level
export function InvoiceModal({ invoice, open, onClose }: InvoiceModalProps) {
  // CORRECTED: The null check is now INSIDE the component function
  if (!invoice) {
    return null;
  }

  const { updateInvoice, deleteInvoice } = useAI();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleExportPDF = async () => {
    // DEBUGGING: Log the invoice object to check its structure
    console.log('Invoice data for PDF:', invoice);

    try {
      // Ensure items is an array before proceeding
      if (!invoice.items || !Array.isArray(invoice.items)) {
          throw new Error("Invoice items are missing or not in the correct format.");
      }
      await generatePDF(invoice);
      toast.success('PDF exported!', {
        description: `Invoice ${invoice.invoiceNumber} has been downloaded.`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error('Export failed', {
        description: 'Failed to generate PDF. Check the console for details.',
      });
    }
  };

  const handleSendToClient = () => {
    if (invoice.status === 'draft' || invoice.status === 'generated') {
      // Correctly update the invoice status via the context
      updateInvoice(invoice.id, { status: 'sent' });
      toast.success('Invoice sent!', {
        description: `Invoice ${invoice.invoiceNumber} has been marked as sent.`,
      });
    } else {
        toast.info("This invoice has already been sent or paid.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
        setIsDeleting(true);
        setTimeout(() => {
          deleteInvoice(invoice.id);
          toast.success("Invoice deleted.");
          setIsDeleting(false);
          onClose(); // Close the modal after deletion
        }, 500);
    }
  };
  
  const handleSaveFromEdit = (updatedInvoice: Invoice) => {
    updateInvoice(updatedInvoice.id, updatedInvoice);
    setIsEditModalOpen(false);
    toast.success("Invoice updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500 hover:bg-emerald-500';
      case 'sent': return 'bg-blue-600 hover:bg-blue-600';
      case 'generated': return 'bg-violet-600 hover:bg-violet-600';
      default: return 'bg-slate-500 hover:bg-slate-500';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Invoice {invoice.invoiceNumber}
                </DialogTitle>
                <DialogDescription>
                  Generated on {new Date(invoice.createdAt).toLocaleDateString()}
                </DialogDescription>
              </div>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Vendor Information</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm">{invoice.vendor}</p>
                  <p className="text-xs text-slate-600">{invoice.vendorAddress}</p>
                  <p className="text-xs text-slate-600">Tax ID: {invoice.vendorTaxId}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Client Information</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm">{invoice.client}</p>
                  <p className="text-xs text-slate-600">{invoice.clientAddress}</p>
                  <p className="text-xs text-slate-600">{invoice.clientEmail}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Invoice Details</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-slate-600">Issue Date</p><p>{invoice.date}</p></div>
                  <div><p className="text-slate-600">Due Date</p><p>{invoice.dueDate}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Line Items</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items && invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className="my-4" />
                <div className="space-y-2 max-w-xs ml-auto">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax (10%)</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <div className='flex gap-2'>
                <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
                <Button onClick={handleSendToClient} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Client
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Modal is rendered separately */}
      <InvoiceModalEdit 
        invoice={invoice}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveFromEdit}
      />
    </>
  );
}