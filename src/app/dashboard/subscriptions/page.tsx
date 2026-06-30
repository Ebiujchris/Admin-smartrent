'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, Search, Filter, 
  CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin.service';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getSubscriptions({ status: statusFilter });
      setSubscriptions(res.subscriptions);
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this subscription as ${newStatus}?`)) return;
    
    try {
      await adminService.updateSubscription(userId, { status: newStatus });
      fetchSubscriptions();
    } catch (error) {
      console.error("Failed to update subscription", error);
      alert("Failed to update subscription status.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case 'EXPIRED': return <XCircle className="h-3 w-3 mr-1" />;
      case 'TRIAL': return <Clock className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'EXPIRED': return 'bg-destructive/10 text-destructive border border-destructive/20';
      case 'TRIAL': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Manage landlord billing and subscription plans.</p>
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
              <option value="ACTIVE">Active</option>
              <option value="TRIAL">Trial</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No subscriptions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Landlord</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Billing Period</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{sub.user.fullName}</span>
                          <span className="text-xs text-muted-foreground">{sub.user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{sub.plan}</span>
                          <span className="text-xs text-muted-foreground">{sub.maxUnits} max units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {getStatusIcon(sub.status)}
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          {sub.status === 'TRIAL' ? (
                            <>
                              <span className="text-muted-foreground">Trial ends:</span>
                              <span className="text-foreground">{new Date(sub.trialEndsAt).toLocaleDateString()}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground">Period ends:</span>
                              <span className="text-foreground">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status !== 'ACTIVE' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                              onClick={() => handleUpdateStatus(sub.userId, 'ACTIVE')}
                            >
                              Activate
                            </Button>
                          )}
                          {sub.status !== 'EXPIRED' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10"
                              onClick={() => handleUpdateStatus(sub.userId, 'EXPIRED')}
                            >
                              Expire
                            </Button>
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
