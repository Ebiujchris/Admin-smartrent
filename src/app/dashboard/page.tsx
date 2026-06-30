'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Building, CreditCard, Activity, 
  ArrowUpRight, ArrowDownRight, UserPlus, 
  Wallet, ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, growthRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getUserGrowthData()
        ]);
        setStats(statsData);
        setGrowthData(growthRes);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">Loading dashboard metrics...</div>;
  }

  const kpis = [
    { title: "Total Users", value: stats?.users.total, icon: Users, desc: `${stats?.users.landlords} Landlords, ${stats?.users.tenants} Tenants`, trend: "+12%", up: true },
    { title: "Active Properties", value: stats?.properties.total, icon: Building, desc: `${stats?.properties.occupied} occupied out of ${stats?.properties.units} units`, trend: "+5%", up: true },
    { title: "Total Revenue", value: `UGX ${stats?.payments.totalRevenue.toLocaleString()}`, icon: Wallet, desc: `From ${stats?.payments.total} successful payments`, trend: "+18%", up: true },
    { title: "Active Subscriptions", value: stats?.subscriptions.active, icon: CreditCard, desc: `${stats?.subscriptions.trial} on trial, ${stats?.subscriptions.expired} expired`, trend: "-2%", up: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground">Platform health and metrics across SmartRent UG.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <kpi.icon className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{kpi.desc}</p>
                <div className={`flex items-center text-xs font-medium ${kpi.up ? 'text-emerald-500' : 'text-destructive'}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {kpi.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-4 bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">User Growth Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLandlords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area type="monotone" dataKey="landlords" name="Landlords" stroke="#10b981" fillOpacity={1} fill="url(#colorLandlords)" />
                <Area type="monotone" dataKey="tenants" name="Tenants" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTenants)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="md:col-span-3 bg-card/50 backdrop-blur-xl border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-6">
              {stats?.recentUsers.map((user: any, i: number) => (
                <div key={`u-${i}`} className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-full border border-blue-500/20">
                    <UserPlus className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">New {user.role.toLowerCase()} joined</p>
                    <p className="text-xs text-muted-foreground">{user.fullName} ({user.email})</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {stats?.recentPayments.map((payment: any, i: number) => (
                <div key={`p-${i}`} className="flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
                    <Wallet className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">Payment Received</p>
                    <p className="text-xs text-muted-foreground">UGX {payment.amount.toLocaleString()} from {payment.tenant?.user?.fullName || 'Unknown'}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {stats?.unreadMessages > 0 && (
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/10 p-2 rounded-full border border-orange-500/20">
                    <ShieldAlert className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">Support Tickets</p>
                    <p className="text-xs text-muted-foreground">You have {stats.unreadMessages} unread messages requiring attention.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
