'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Filter, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin.service';

interface ConfirmModal {
  isOpen: boolean;
  userId: string;
  userName: string;
  newStatus: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    isOpen: false, userId: '', userName: '', newStatus: '',
  });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getSubscriptions({ status: statusFilter });
      setSubscriptions(res.subscriptions);
    } catch (error) {
      console.error('Failed to fetch subscriptions', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openConfirm = (userId: string, userName: string, newStatus: string) => {
    setConfirmModal({ isOpen: true, userId, userName, newStatus });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, userId: '', userName: '', newStatus: '' });
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    try {
      await adminService.updateSubscription(confirmModal.userId, { status: confirmModal.newStatus });
      showToast(
        `${confirmModal.userName}'s subscription ${confirmModal.newStatus === 'ACTIVE' ? 'activated' : 'expired'} successfully`,
        'success'
      );
      fetchSubscriptions();
    } catch (error) {
      showToast('Failed to update subscription', 'error');
    } finally {
      setIsUpdating(false);
      closeConfirm();
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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.message}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${confirmModal.newStatus === 'ACTIVE' ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                <AlertTriangle className={`h-6 w-6 ${confirmModal.newStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-destructive'}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Confirm Action</h3>
            </div>
            <p className="text-muted-foreground mb-2">
              Are you sure you want to{' '}
              <span className={`font-semibold ${confirmModal.newStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-destructive'}`}>
                {confirmModal.newStatus === 'ACTIVE' ? 'activate' : 'expire'}
              </span>{' '}
              the subscription for:
            </p>
            <p className="text-foreground font-semibold text-lg mb-1">{confirmModal.userName}</p>
            {confirmModal.newStatus === 'ACTIVE' && (
              <p className="text-xs text-muted-foreground mb-4">
                This will set the subscription as ACTIVE for 1 year from today.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeConfirm}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 ${confirmModal.newStatus === 'ACTIVE'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-destructive hover:bg-destructive/90'}`}
                onClick={handleConfirmUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Processing...' : confirmModal.newStatus === 'ACTIVE' ? 'Activate' : 'Expire'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground">Manage landlord billing and subscription plans.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
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
                    <th className="px-6 py-4 font-medium">Period Ends</th>
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
                        <span className="font-medium text-foreground">{sub.plan}</span>
                        <span className="text-xs text-muted-foreground block">{sub.maxUnits} max units</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {getStatusIcon(sub.status)}
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {sub.status === 'TRIAL' && sub.trialEndsAt
                          ? new Date(sub.trialEndsAt).toLocaleDateString()
                          : sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status !== 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                              onClick={() => openConfirm(sub.userId, sub.user.fullName, 'ACTIVE')}
                            >
                              Activate
                            </Button>
                          )}
                          {sub.status !== 'EXPIRED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10"
                              onClick={() => openConfirm(sub.userId, sub.user.fullName, 'EXPIRED')}
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
