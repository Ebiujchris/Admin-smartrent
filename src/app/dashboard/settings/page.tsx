'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile and system preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              <CardTitle>Admin Profile</CardTitle>
            </div>
            <CardDescription>Your current administrative account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 items-center gap-4 border-b border-border/50 pb-4">
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="col-span-2 text-sm text-foreground">{user?.fullName}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 border-b border-border/50 pb-4">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="col-span-2 text-sm text-foreground">{user?.email}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="col-span-2 text-sm font-medium text-emerald-500">{user?.role}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50 opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Platform Configuration</CardTitle>
            </div>
            <CardDescription>Global system settings (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Subscription pricing, trial duration, and payment gateway configurations will be available here in a future update.
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card/50 backdrop-blur-xl border-border/50 opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security & API</CardTitle>
            </div>
            <CardDescription>Manage API keys and security settings (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Flutterwave/Pesapal webhook secrets and external API integrations.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
