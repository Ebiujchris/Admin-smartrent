import { Bell, Search, UserCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function AdminHeader() {
  const user = useAuthStore(state => state.user);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-card/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Search platform..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-foreground relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full border border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-foreground">{user?.fullName || 'Admin'}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase() || 'Administrator'}</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <UserCircle className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
