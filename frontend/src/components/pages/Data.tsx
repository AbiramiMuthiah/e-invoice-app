import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { FileText, DollarSign, TrendingUp } from 'lucide-react';
import { useAI } from '../../context/AIContext';

export default function Data() {
  const { invoices } = useAI();

  // Calculate statistics
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const averageInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const generatedInvoices = invoices.filter(inv => inv.status === 'generated').length;

  // Recent activity
  const recentInvoices = invoices.slice(0, 5);

  // Status distribution
  const statusStats = {
    paid: invoices.filter(inv => inv.status === 'paid').length,
    generated: invoices.filter(inv => inv.status === 'generated').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Data Analytics</h1>
        <p className="text-[#64748b]">
          Comprehensive view of your invoicing data and analytics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#64748b] mb-1">Total Invoices</p>
                <p className="text-3xl font-bold text-[#1e293b]">{totalInvoices}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#64748b] mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-[#1e293b]">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#64748b] mb-1">Average Invoice</p>
                <p className="text-3xl font-bold text-[#1e293b]">${averageInvoice.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-[#64748b]">Paid</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#1e293b] font-medium">{statusStats.paid}</span>
                  <span className="text-[#64748b] text-sm">
                    ({totalInvoices > 0 ? ((statusStats.paid / totalInvoices) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-[#64748b]">Generated</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#1e293b] font-medium">{statusStats.generated}</span>
                  <span className="text-[#64748b] text-sm">
                    ({totalInvoices > 0 ? ((statusStats.generated / totalInvoices) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-[#64748b]">Draft</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#1e293b] font-medium">{statusStats.draft}</span>
                  <span className="text-[#64748b] text-sm">
                    ({totalInvoices > 0 ? ((statusStats.draft / totalInvoices) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <span className="text-[#64748b]">Sent</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#1e293b] font-medium">{statusStats.sent}</span>
                  <span className="text-[#64748b] text-sm">
                    ({totalInvoices > 0 ? ((statusStats.sent / totalInvoices) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <p className="text-center text-[#64748b] py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1e293b] font-medium truncate">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-[#64748b] truncate">{invoice.vendor}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#1e293b] font-medium">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-[#64748b]">{invoice.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({totalInvoices})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#64748b]">
                    No invoices found. Create your first invoice to see data here.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-slate-50">
                    <TableCell className="text-[#1e293b] font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-[#64748b]">{invoice.vendor}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.client}</TableCell>
                    <TableCell className="text-[#1e293b] font-medium">
                      ${invoice.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[#64748b]">{invoice.date}</TableCell>
                    <TableCell className="text-[#64748b]">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          invoice.status === 'paid'
                            ? 'bg-emerald-500 hover:bg-emerald-500'
                            : invoice.status === 'generated'
                            ? 'bg-blue-500 hover:bg-blue-500'
                            : invoice.status === 'sent'
                            ? 'bg-violet-500 hover:bg-violet-500'
                            : 'bg-amber-500 hover:bg-amber-500'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}