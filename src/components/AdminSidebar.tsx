import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Building, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Properties', href: '/dashboard/properties', icon: Building },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="flex flex-col w-64 bg-card/50 backdrop-blur-xl border-r border-border h-full">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">SmartRent<span className="text-emerald-500">UG</span></span>
        </Link>
        <div className="text-xs font-medium text-emerald-500 tracking-widest mt-1 uppercase">Admin Portal</div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }
                `}
              >
                <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
