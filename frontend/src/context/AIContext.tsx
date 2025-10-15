import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// --- TYPE DEFINITIONS ---
// Defines the structure for a single line item in an invoice.
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Defines the structure for a complete invoice object.
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

// Defines the shape of the data and functions available in our context.
interface AIContextType {
  invoices: Invoice[];
  isProcessing: boolean;
  processReceipt: (file: File) => Promise<any>;
  createInvoice: (invoiceData: any) => Invoice;
  updateInvoice: (invoiceId: string, updatedData: Partial<Invoice>) => void;
  deleteInvoice: (invoiceId: string) => void;
}

// --- CONTEXT CREATION ---
const AIContext = createContext<AIContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
// This component will wrap our application and provide the AI context to all children.
export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // State initialization with data persistence from Local Storage.
  // This function runs only once when the app first loads.
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        console.log("✅ Invoices loaded from Local Storage.");
        return JSON.parse(savedInvoices);
      }
      return [];
    } catch (error) {
      console.error("❌ Failed to load invoices from Local Storage", error);
      return [];
    }
  });

  // Effect to save invoices to Local Storage whenever they change.
  // This ensures data is not lost on page refresh or navigation.
  useEffect(() => {
    try {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    } catch (error) {
      console.error("❌ Failed to save invoices to Local Storage", error);
    }
  }, [invoices]); // This effect runs every time the `invoices` array is updated.

  // --- API AND DATA FUNCTIONS ---

  /**
   * Processes an uploaded image file by sending it to the backend server.
   * The backend handles OCR and AI data structuring.
   */
  const processReceipt = async (file: File): Promise<any> => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('invoiceImage', file);

    try {
      const response = await fetch('http://localhost:3001/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server failed to process the receipt.');
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      toast.error("Processing Failed", { description: error.message });
      throw error; // Re-throw error to be caught by the calling component
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Creates a new invoice, sanitizes the data, and adds it to the state.
   * This is the most critical function for preventing app crashes.
   */
  const createInvoice = (invoiceData: any): Invoice => {
    // 1. Sanitize incoming items to ensure all monetary values are numbers.
    const safeItems = (invoiceData.items || []).map((item: any) => ({
      ...item,
      id: item.id || Math.random().toString(36).substring(7),
      quantity: parseFloat(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: (parseFloat(item.quantity) || 1) * (parseFloat(item.unitPrice) || 0),
    }));

    // 2. Recalculate totals from the sanitized items to guarantee they are numbers.
    const subtotal = safeItems.reduce((sum: number, item: InvoiceItem) => sum + item.total, 0);
    const tax = subtotal * 0.1; // Example 10% tax
    const total = subtotal + tax;

    // 3. Construct the final, safe invoice object.
    const newInvoice: Invoice = {
      // Start with the incoming data...
      ...invoiceData,
      // ...then overwrite crucial fields to ensure correctness and type safety.
      id: `${Date.now()}`,
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(4, '0')}`,
      status: 'generated',
      createdAt: new Date().toISOString(),
      items: safeItems,
      subtotal, // Guaranteed to be a number
      tax,      // Guaranteed to be a number
      total,    // Guaranteed to be a number
    };

    setInvoices(prev => [...prev, newInvoice]);
    toast.success("Invoice created successfully!", {
      description: `Invoice ${newInvoice.invoiceNumber} has been added.`
    });
    return newInvoice;
  };

  /**
   * Updates an existing invoice in the state.
   */
  const updateInvoice = (invoiceId: string, updatedData: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? { ...inv, ...updatedData } : inv))
    );
  };

  /**
   * Deletes an invoice from the state.
   */
  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  };

  // --- PROVIDER VALUE ---
  // The value that will be available to all components wrapped by this provider.
  const contextValue = {
    invoices,
    isProcessing,
    processReceipt,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoiceFromText: async () => {}, // Placeholder for future implementation
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

// --- CUSTOM HOOK ---
// A helper hook to easily access the context in any component.
export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};