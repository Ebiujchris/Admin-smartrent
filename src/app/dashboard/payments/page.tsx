'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, Search, Filter, 
  CheckCircle2, Clock, XCircle, Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPayments({ status: statusFilter });
      setPayments(res.payments);
      setTotalRevenue(res.totalRevenue);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case 'OVERDUE':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20"><XCircle className="h-3 w-3 mr-1" /> Overdue</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground">Monitor platform-wide payment activity.</p>
        </div>
        <div className="flex items-center gap-3 bg-card/50 backdrop-blur-xl border border-border/50 px-4 py-2 rounded-lg">
          <div className="p-2 bg-emerald-500/10 rounded-full">
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
            <div className="font-bold text-foreground">UGX {totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background/50 border border-border/50 text-sm rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No payments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Transaction ID / Ref</th>
                    <th className="px-6 py-4 font-medium">Tenant</th>
                    <th className="px-6 py-4 font-medium">Property / Unit</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-muted-foreground">{payment.id.substring(0, 10)}...</span>
                        <div className="text-xs text-foreground mt-1">Ref: {payment.reference || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{payment.tenant?.user?.fullName || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">{payment.tenant?.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{payment.lease?.unit?.property?.name || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">Unit {payment.lease?.unit?.unitNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        UGX {parseFloat(payment.amount).toLocaleString()}
                        <div className="text-xs font-normal text-muted-foreground mt-0.5">{payment.method || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-muted-foreground">Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                          {payment.paidDate && (
                            <span className="text-emerald-500 mt-0.5">Paid: {new Date(payment.paidDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
