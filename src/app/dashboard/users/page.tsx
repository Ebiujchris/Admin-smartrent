'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Search, Filter, MoreVertical, 
  ShieldOff, Shield, Trash2, Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin.service';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers({ search, role: roleFilter });
      setUsers(res.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]); // Re-fetch on filter change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSuspendToggle = async (userId: string, currentlySuspended: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlySuspended ? 'unsuspend' : 'suspend'} this user?`)) return;
    
    try {
      if (currentlySuspended) {
        await adminService.unsuspendUser(userId);
      } else {
        await adminService.suspendUser(userId);
      }
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle suspension", error);
      alert("Action failed. Admins cannot be suspended.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you absolutely sure? This will delete the user and all their associated data permanently.")) return;
    
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Deletion failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage landlords, tenants, and their platform access.</p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <form onSubmit={handleSearch} className="flex flex-1 w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-background/50 border border-border/50 text-sm rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Roles</option>
              <option value="LANDLORD">Landlords</option>
              <option value="TENANT">Tenants</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.fullName}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                          <span className="text-xs text-muted-foreground">{user.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                          ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 
                            user.role === 'LANDLORD' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isSuspended ? (
                          <span className="flex items-center text-destructive text-xs font-medium">
                            <ShieldOff className="h-3 w-3 mr-1" /> Suspended
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-500 text-xs font-medium">
                            <Shield className="h-3 w-3 mr-1" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleSuspendToggle(user.id, user.isSuspended)}
                            disabled={user.role === 'ADMIN'}
                            className={`p-1.5 rounded hover:bg-muted transition-colors ${user.isSuspended ? 'text-emerald-500 hover:text-emerald-400' : 'text-orange-500 hover:text-orange-400'}`}
                            title={user.isSuspended ? "Unsuspend User" : "Suspend User"}
                          >
                            {user.isSuspended ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={user.role === 'ADMIN'}
                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
