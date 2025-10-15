import { useState, useRef } from "react";
import {
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  Upload,
  Eye,
  Send,
  Trash2,
  Loader2,
  Edit,
  Search,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import MetricCard from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { InvoiceModal } from "./InvoiceModal";
import { InvoiceModalEdit } from "./InvoiceModalEdit";
import { useAI } from "../context/AIContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

export default function Dashboard() {
  // --- All state and hooks go at the top of the function ---
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentView, setCurrentView] = useState<"dashboard" | "create">("dashboard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { invoices, processReceipt, isProcessing, deleteInvoice, updateInvoice, createInvoice } = useAI();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const invoice = await processReceipt(file);
      setSelectedInvoice(invoice);
      setInvoiceModalOpen(true);
      toast.success("Receipt processed successfully!");
    } catch (error) {
      toast.error("Failed to process receipt. Please try again.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateInvoice = () => {
    setCurrentView("create");
  };

  const handleSaveNewInvoice = (invoiceData: any) => {
    createInvoice(invoiceData);
    toast.success("Invoice created successfully!");
    setCurrentView("dashboard");
  };

  const handleCancelCreate = () => {
    setCurrentView("dashboard");
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoiceId);
      toast.success("Invoice deleted successfully!");
    }
  };

  const handleSaveInvoice = (updatedInvoice: any) => {
    updateInvoice(updatedInvoice.id, updatedInvoice);
    setIsEditModalOpen(false);
    toast.success("Invoice updated successfully!");
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === "generated").length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

  const CreateInvoicePage = () => {
    const [formData, setFormData] = useState({
      vendor: user?.company || "",
      vendorAddress: "",
      vendorTaxId: "",
      client: "",
      clientAddress: "",
      clientEmail: "",
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { id: 1, description: 'Professional Services', quantity: 1, unitPrice: 1000, total: 1000 }
      ],
    });

    const handleInputChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
      const updatedItems = [...formData.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
      }
      setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const addNewItem = () => {
      setFormData(prev => ({
        ...prev,
        items: [
          ...prev.items,
          { id: prev.items.length + 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
        ]
      }));
    };

    const removeItem = (index: number) => {
      if (formData.items.length > 1) {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
      }
    };

    const handleSubmit = () => {
      handleSaveNewInvoice(formData);
    };

    const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);

    return (
      <div className="p-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancelCreate}
            className="gap-2 text-[#64748b] hover:text-[#1e293b] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Create New Invoice</h1>
              <p className="text-[#64748b]">Fill in the details below to create a new invoice</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelCreate}
                className="border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] w-32"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#d1d5db] hover:bg-[#f3f4f6] text-[#374151] w-32"
              >
                Save Invoice
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Vendor Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">Vendor Name</label>
                    <Input value={formData.vendor} onChange={(e) => handleInputChange('vendor', e.target.value)} placeholder="Your company name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">Tax ID</label>
                    <Input value={formData.vendorTaxId} onChange={(e) => handleInputChange('vendorTaxId', e.target.value)} placeholder="Tax identification number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Vendor Address</label>
                  <textarea value={formData.vendorAddress} onChange={(e) => handleInputChange('vendorAddress', e.target.value)} className="w-full h-20 p-2 border border-[#d1d5db] rounded-md resize-none" placeholder="Enter vendor address" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">Client Name</label>
                    <Input value={formData.client} onChange={(e) => handleInputChange('client', e.target.value)} placeholder="Client company name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">Client Email</label>
                    <Input value={formData.clientEmail} onChange={(e) => handleInputChange('clientEmail', e.target.value)} placeholder="billing@client.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Client Address</label>
                  <textarea value={formData.clientAddress} onChange={(e) => handleInputChange('clientAddress', e.target.value)} className="w-full h-20 p-2 border border-[#d1d5db] rounded-md resize-none" placeholder="Enter client address" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Invoice Items</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5 space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Description</label>
                        <Input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Item description" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Quantity</label>
                        <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} min="1" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Unit Price</label>
                        <Input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} step="0.01" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-[#374151]">Total</label>
                        <Input value={`$${item.total.toFixed(2)}`} disabled className="bg-gray-50" />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <Button variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={formData.items.length === 1} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addNewItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Invoice Date</label>
                  <Input type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Due Date</label>
                  <Input type="date" value={formData.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Invoice Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748b]">Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748b]">Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748b]">Discount:</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === "create") {
    return <CreateInvoicePage />;
  }

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1e293b] mb-2">
            Welcome, {user?.name.split(" ")[0] || "User"}
          </h1>
          <p className="text-[#64748b]">
            Here's what's happening with your invoices today.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload Receipt
          </Button>
          <Button
            onClick={handleCreateInvoice}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Progress value={50} className="flex-1" />
              <span className="text-sm text-[#64748b]">
                AI is processing your receipt...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Invoices"
          value={invoices.length.toString()}
          icon={FileText}
          trend="+12.5%"
          trendUp={true}
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8.2%"
          trendUp={true}
          color="green"
        />
        <MetricCard
          title="Pending"
          value={pendingInvoices.toString()}
          icon={Calendar}
          trend="-3.1%"
          trendUp={false}
          color="orange"
        />
        <MetricCard
          title="Paid"
          value={paidInvoices.toString()}
          icon={TrendingUp}
          trend="+15.3%"
          trendUp={true}
          color="purple"
        />
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1e293b]">Recent Invoices</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#64748b]">
                    {searchQuery || statusFilter !== "all"
                      ? "No invoices match your filters."
                      : "No invoices generated yet. Upload a receipt to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-slate-50">
                    <TableCell className="text-[#1e293b]">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.vendor}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.client}</TableCell>
                    <TableCell className="text-[#64748b]">${invoice.total.toFixed(2)}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.date}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.status === "sent" || invoice.status === "paid" ? "default" : "secondary"}
                        className={
                          invoice.status === "paid" ? "bg-[#10b981] hover:bg-[#059669]"
                          : invoice.status === "sent" ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                          : invoice.status === "generated" ? "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                          : "bg-[#f59e0b] hover:bg-[#d97706]"
                        }
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInvoice(invoice)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditInvoice(invoice)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteInvoice(invoice.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredInvoices.length > 0 && (
            <div className="p-4 border-t border-slate-200 text-sm text-[#64748b]">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          )}
        </CardContent>
      </Card>

      <InvoiceModal
        invoice={selectedInvoice}
        open={invoiceModalOpen}
        onClose={() => {
          setInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
      />

      <InvoiceModalEdit
        invoice={selectedInvoice}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSave={handleSaveInvoice}
      />
    </div>
  );
}