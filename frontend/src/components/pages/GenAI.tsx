import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Sparkles, Upload, FileText, Loader2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAI } from '../../context/AIContext';
import { useNavigate } from 'react-router-dom';

interface ProcessedDocument {
  id: number;
  name: string;
  size: number;
  uploadDate: string;
  status: 'processing' | 'processed' | 'error' | 'invoice_created';
  extractedData?: any;
  error?: string;
}

export default function GenAI() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createInvoice, processReceipt } = useAI();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files) return;
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to upload queue`);
  };

  const handleProcessAll = async () => {
    if (uploadedFiles.length === 0) return toast.error('No files to process');
    setIsProcessing(true);
    
    const newDocs: ProcessedDocument[] = uploadedFiles.map((file, i) => ({
      id: Date.now() + i, name: file.name, size: file.size,
      uploadDate: new Date().toLocaleDateString(), status: 'processing',
    }));
    setProcessedDocuments(prev => [...prev, ...newDocs]);

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const docToProcess = newDocs[i];
      setCurrentProcessingFile(file.name);
      
      try {
        // This calls your powerful backend AI
        const extractedData = await processReceipt(file); 
        const processedDoc = { ...docToProcess, status: 'processed', extractedData };
        setProcessedDocuments(prev => prev.map(doc => (doc.id === docToProcess.id ? processedDoc : doc)));
        toast.success(`Processed: ${file.name}`);
      } catch (error) {
        const errorDoc = { ...docToProcess, status: 'error', error: error.message };
        setProcessedDocuments(prev => prev.map(doc => (doc.id === docToProcess.id ? errorDoc : doc)));
      }
      setProcessingProgress(((i + 1) / uploadedFiles.length) * 100);
    }

    setUploadedFiles([]);
    setIsProcessing(false);
    toast.success('All documents processed!');
  };

  const handleCreateInvoiceFromDocument = (document: ProcessedDocument) => {
    if (!document.extractedData) return toast.error('No data to create invoice from.');
    const newInvoice = createInvoice({
      ...document.extractedData,
      client: document.extractedData.client || 'Client Name (Edit)', // Add placeholders
      clientAddress: document.extractedData.clientAddress || 'Client Address (Edit)',
      clientEmail: document.extractedData.clientEmail || 'client@email.com',
    });
    setProcessedDocuments(prev => prev.map(doc => doc.id === document.id ? { ...doc, status: 'invoice_created' } : doc));
    toast.success('Invoice created!', {
      action: { label: 'View Dashboard', onClick: () => navigate('/') },
    });
  };

  // --- Helper functions and JSX (No changes needed below) ---
  const handleRemoveFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">AI Document Processing</h1>
        <p className="text-slate-600">Upload receipts and documents to automatically generate invoices using AI.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Upload Documents</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
            <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p>Drag and drop or click to browse</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p>{uploadedFiles.length} file(s) ready</p>
                  <Button onClick={handleProcessAll} disabled={isProcessing} className="gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Process All
                  </Button>
                </div>
                {uploadedFiles.map((f, i) => <div key={i} className="flex justify-between p-2 border rounded">{f.name}<Button variant="ghost" size="sm" onClick={() => handleRemoveFile(i)}>Remove</Button></div>)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Processing Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between"><span>Total Processed</span><span>{processedDocuments.length}</span></div>
                <div className="flex justify-between"><span>Invoices Created</span><span>{processedDocuments.filter(d => d.status === 'invoice_created').length}</span></div>
                <div className="flex justify-between"><span>Errors</span><span>{processedDocuments.filter(d => d.status === 'error').length}</span></div>
            </CardContent>
        </Card>
      </div>
      {isProcessing && <Card><CardContent className="pt-6"><p>Processing: {currentProcessingFile}</p><Progress value={processingProgress} /></CardContent></Card>}
      <Card>
        <CardHeader><CardTitle>Processed Documents</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Status</TableHead><TableHead>Extracted Data</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {processedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell><Badge variant={doc.status === 'error' ? 'destructive' : 'default'}>{doc.status}</Badge>{doc.error && <p className="text-xs text-red-500">{doc.error}</p>}</TableCell>
                  <TableCell className="text-xs">{doc.extractedData ? `${doc.extractedData.vendor} - $${doc.extractedData.total}`: '-'}</TableCell>
                  <TableCell>{doc.status === 'processed' && <Button size="sm" onClick={() => handleCreateInvoiceFromDocument(doc)}>Create Invoice</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}