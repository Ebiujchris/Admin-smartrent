'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!mounted || !token || user?.role !== 'ADMIN') {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - fixed on desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
