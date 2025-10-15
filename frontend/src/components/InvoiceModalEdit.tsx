import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { toast } from 'sonner@2.0.3';

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

interface InvoiceModalEditProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceModalEdit({ invoice, open, onClose }: InvoiceModalEditProps) {
  const { updateInvoice } = useAI();
  const [editableInvoice, setEditableInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (invoice) {
      setEditableInvoice(JSON.parse(JSON.stringify(invoice)));
    }
  }, [invoice]);

  if (!editableInvoice) return null;

  const handleFieldChange = (field: keyof Invoice, value: any) => {
    setEditableInvoice(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!editableInvoice) return;
    
    const updatedItems = [...editableInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Recalculate total if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? parseFloat(value) || 0 : updatedItems[index].quantity;
      const price = field === 'unitPrice' ? parseFloat(value) || 0 : updatedItems[index].unitPrice;
      updatedItems[index].total = qty * price;
    }

    setEditableInvoice(prev => prev ? { ...prev, items: updatedItems } : null);
  };

  const addNewItem = () => {
    if (!editableInvoice) return;
    
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };

    setEditableInvoice(prev => prev ? {
      ...prev,
      items: [...prev.items, newItem]
    } : null);
  };

  const removeItem = (index: number) => {
    if (!editableInvoice) return;
    
    const updatedItems = editableInvoice.items.filter((_, i) => i !== index);
    setEditableInvoice(prev => prev ? { ...prev, items: updatedItems } : null);
  };

  const handleSave = () => {
    if (!editableInvoice) return;

    // Recalculate totals
    const subtotal = editableInvoice.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const updatedInvoice = {
      ...editableInvoice,
      subtotal,
      tax,
      total
    };

    updateInvoice(updatedInvoice.id, updatedInvoice);
    toast.success('Invoice updated!', {
      description: 'Changes have been saved successfully'
    });
    onClose();
  };

  const subtotal = editableInvoice.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice {editableInvoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Make changes to your invoice. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="vendor">Vendor Name</Label>
                  <Input
                    id="vendor"
                    value={editableInvoice.vendor}
                    onChange={(e) => handleFieldChange('vendor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorAddress">Address</Label>
                  <Textarea
                    id="vendorAddress"
                    value={editableInvoice.vendorAddress}
                    onChange={(e) => handleFieldChange('vendorAddress', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorTaxId">Tax ID</Label>
                  <Input
                    id="vendorTaxId"
                    value={editableInvoice.vendorTaxId}
                    onChange={(e) => handleFieldChange('vendorTaxId', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={editableInvoice.client}
                    onChange={(e) => handleFieldChange('client', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={editableInvoice.clientAddress}
                    onChange={(e) => handleFieldChange('clientAddress', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={editableInvoice.clientEmail}
                    onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Issue Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editableInvoice.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={editableInvoice.dueDate}
                    onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Line Items</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={addNewItem}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-32">Unit Price</TableHead>
                    <TableHead className="w-32">Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableInvoice.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
